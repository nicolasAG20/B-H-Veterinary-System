import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, Between } from 'typeorm';
import { Factura, EstadoFactura } from './entities/factura.entity';
import { Cita, EstadoCita } from '../cita/entities/cita.entity';
import { Producto } from '../producto/entities/producto.entity';
import { Cliente } from '../cliente/entities/cliente.entity';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { GenerarFacturaDto } from './dto/generar-factura.dto';
import { AplicarDescuentoDto } from './dto/aplicar-descuento.dto';
import { AnularFacturaDto } from './dto/anular-factura.dto';
import { resolve } from 'path';
import { timeout } from 'rxjs';
import {
  ActorAuditoria,
  AUDIT_CLIENT,
  IAuditClient,
  TipoAccion,
} from '../audit/audit.types';

const PDFDocument = require('pdfkit-table');

export interface DetalleItem {
  descripcion: string;
  tipo: 'SERVICIO' | 'MEDICAMENTO';
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

@Injectable()
export class FacturaService {
  constructor(
    @InjectRepository(Factura)
    private readonly facturaRepository: Repository<Factura>,
    @InjectRepository(Cita)
    private readonly citaRepository: Repository<Cita>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @Inject(AUDIT_CLIENT)
    private readonly auditClient: IAuditClient,
  ) {}

  async create(createFacturaDto: CreateFacturaDto) {
    const { citaId, ...rest } = createFacturaDto;
    const factura = this.facturaRepository.create({
      ...rest,
      cita: { idCita: citaId } as any,
    });
    await this.facturaRepository.save(factura);
    return { message: 'Factura creada correctamente', factura };
  }

  async findAll() {
    return this.facturaRepository.find({ relations: ['cita'] });
  }

  async findOne(id: number) {
    const factura = await this.facturaRepository.findOne({
      where: { idFactura: id },
      relations: [
        'cita',
        'cita.servicios',
        'cita.historiales',
        'cita.historiales.medicamentos',
        'cita.historiales.medicamentos.producto',
      ],
    });
    if (!factura) {
      throw new NotFoundException(`Factura #${id} no encontrada`);
    }
    return this.buildFacturaResponse(factura);
  }

  async update(id: number, updateFacturaDto: UpdateFacturaDto) {
    const existing = await this.facturaRepository.findOne({
      where: { idFactura: id },
      relations: ['cita'],
    });
    if (!existing) throw new NotFoundException(`Factura #${id} no encontrada`);

    const { citaId, ...rest } = updateFacturaDto;
    const updateData: any = Object.fromEntries(
      Object.entries(rest).filter(([, v]) => v !== undefined),
    );
    if (citaId !== undefined) updateData.cita = { idCita: citaId };
    await this.facturaRepository.update(id, updateData);
    return { message: 'Factura actualizada', factura: await this.findOne(id) };
  }

  async remove(id: number) {
    const existing = await this.facturaRepository.findOne({
      where: { idFactura: id },
    });
    if (!existing) throw new NotFoundException(`Factura #${id} no encontrada`);
    await this.facturaRepository.delete(id);
    return { message: 'Factura eliminada correctamente' };
  }

  async generarFactura(
    citaId: number,
    dto: GenerarFacturaDto,
    actor: ActorAuditoria,
  ) {
    const { descuento = 0, medicamentos_adicionales = [] } = dto;

    const cita = await this.citaRepository.findOne({
      where: { idCita: citaId },
      relations: [
        'servicios',
        'historiales',
        'historiales.medicamentos',
        'historiales.medicamentos.producto',
      ],
    });

    if (!cita) {
      throw new NotFoundException(`Cita #${citaId} no encontrada`);
    }

    if (cita.estado !== EstadoCita.FINALIZADA) {
      throw new BadRequestException(
        'Solo se puede generar factura para citas finalizadas',
      );
    }

    const facturaExistente = await this.facturaRepository.findOne({
      where: { cita: { idCita: citaId }, estado: EstadoFactura.PENDIENTE },
    });

    if (facturaExistente) {
      throw new BadRequestException(
        `Ya existe una factura pendiente para la cita #${citaId}`,
      );
    }

    // Ítems de servicios de la cita
    const detallesServicios: DetalleItem[] = (cita.servicios ?? []).map((s) => ({
      descripcion: s.nombre,
      tipo: 'SERVICIO',
      cantidad: 1,
      precio_unitario: s.precio,
      subtotal: s.precio,
    }));

    // Ítems de medicamentos del historial médico
    const detallesMedicamentosHistorial: DetalleItem[] = (cita.historiales ?? []).flatMap((h) =>
      (h.medicamentos ?? []).map((m) => ({
        descripcion: m.nombre,
        tipo: 'MEDICAMENTO' as const,
        cantidad: 1,
        precio_unitario: Number(m.producto?.precio ?? 0),
        subtotal: Number(m.producto?.precio ?? 0),
      })),
    );

    // Ítems de medicamentos adicionales enviados por la recepcionista
    let detallesMedicamentosAdicionales: DetalleItem[] = [];
    if (medicamentos_adicionales.length > 0) {
      const productoIds = medicamentos_adicionales.map((m) => m.productoId);
      const productos = await this.productoRepository.findBy({
        idProducto: In(productoIds),
      });

      detallesMedicamentosAdicionales = medicamentos_adicionales.map((ma) => {
        const producto = productos.find((p) => p.idProducto === ma.productoId);
        const precio_unitario = Number(producto?.precio ?? 0);
        return {
          descripcion: producto?.nombre ?? `Producto #${ma.productoId}`,
          tipo: 'MEDICAMENTO' as const,
          cantidad: ma.cantidad,
          precio_unitario,
          subtotal: precio_unitario * ma.cantidad,
        };
      });
    }

    const detalles: DetalleItem[] = [
      ...detallesServicios,
      ...detallesMedicamentosHistorial,
      ...detallesMedicamentosAdicionales,
    ];

    const subtotal = detalles.reduce((acc, i) => acc + i.subtotal, 0);
    const total = subtotal - descuento;

    const factura = await this.facturaRepository.save(
      this.facturaRepository.create({
        subtotal,
        total,
        descuento,
        estado: EstadoFactura.PENDIENTE,
        cita: { idCita: citaId } as any,
      }),
    );

    await this.registrarEvento(TipoAccion.CREACION_FACTURA, actor);

    return {
      idFactura: factura.idFactura,
      subtotal: factura.subtotal,
      total: factura.total,
      descuento: factura.descuento,
      estado: factura.estado,
      citaId,
      detalles,
    };
  }

  async anularFactura(
    id: number,
    dto: AnularFacturaDto,
    actor: ActorAuditoria,
  ) {
    const factura = await this.facturaRepository.findOne({
      where: { idFactura: id },
    });

    if (!factura) {
      throw new NotFoundException(`Factura #${id} no encontrada`);
    }

    if (factura.estado === EstadoFactura.ANULADA) {
      throw new ConflictException('La factura ya se encuentra anulada');
    }

    factura.estado = EstadoFactura.ANULADA;
    factura.motivo_anulacion = dto.motivo_anulacion;

    await this.facturaRepository.save(factura);

    await this.registrarEvento(TipoAccion.ANULACION_FACTURA, actor);

    return { message: 'Factura anulada correctamente' };
  }

  /**
   * Notifica a bh-audit un evento relacionado con facturación,
   * identificando como actor a la recepcionista que originó la operación.
   */
  private async registrarEvento(
    tipoAccion: TipoAccion,
    actor: ActorAuditoria,
  ): Promise<void> {
    await this.auditClient.registrar({
      tipo_accion: tipoAccion,
      usuarioId: actor.id,
      nombre_usuario: actor.nombre,
      rol: actor.rol,
      fecha_hora: new Date().toISOString(),
    });
  }

  async aplicarDescuento(id: number, dto: AplicarDescuentoDto) {
    const factura = await this.facturaRepository.findOne({
      where: { idFactura: id },
      relations: [
        'cita',
        'cita.servicios',
        'cita.historiales',
        'cita.historiales.medicamentos',
        'cita.historiales.medicamentos.producto',
      ],
    });

    if (!factura) {
      throw new NotFoundException(`Factura #${id} no encontrada`);
    }

    if (factura.estado !== EstadoFactura.PENDIENTE) {
      throw new BadRequestException(
        'Solo se puede aplicar descuento a facturas en estado PENDIENTE',
      );
    }

    if (factura.descuento !== null && factura.descuento > 0) {
      throw new BadRequestException(
        'La factura ya tiene un descuento aplicado y no puede modificarse',
      );
    }

    const montoDescuento = Number(
      ((factura.subtotal * dto.porcentaje_descuento) / 100).toFixed(2),
    );

    factura.descuento = montoDescuento;
    factura.total = Number((factura.subtotal - montoDescuento).toFixed(2));

    await this.facturaRepository.save(factura);
    return this.buildFacturaResponse(factura);
  }

    async generarPDF(id: number): Promise<Buffer>{
      const factura = await this.facturaRepository.findOne({
      where: { idFactura: id },
      relations: [
        'cita',
        'cita.servicios',
        'cita.usuario',
        'cita.mascota',
        'cita.mascota.cliente', 
        'cita.historiales',
        'cita.historiales.medicamentos',
        'cita.historiales.medicamentos.producto',
        'cita.mascota.cliente.usuario',
      ],
    });
      
    
    if (!factura) {
      throw new NotFoundException(`Factura #${id} no encontrada`);
    }
    const cita = factura.cita ; 
    const usuario = cita.usuario;
    const clienteNombre = cita.mascota.cliente.usuario.nombre; 
    const servicios = cita.servicios; 
      const pdfBuffer: Buffer = await new Promise( resolve => {
        const doc = new PDFDocument(
          {
            size: "LETTER" , 
            bufferPages: true ,
            autoFirstPage : false
          }
        )
        doc.addPage(); 
        doc.fontSize(24);
        doc.text("BH Veterinaria" ,{
          align: 'center'
        }); 
        doc.fontSize(14);
        doc.text("Factura electronica " ,{
          align: 'center'
        }); 
        doc.fontSize(10);
        doc.text(`ID Factura: ${factura.idFactura}`,{
          align: 'center'
        });
         doc.moveDown();
        
        
        doc.moveDown();
        doc.fontSize(12);
        doc.text(`Cliente: ${clienteNombre}`,{
          align: 'center'
        });
        doc.text(`Mascota: ${cita.mascota.nombre}`,{
          align: 'center'
        });
        doc.moveDown();
        doc.text(`ID usuario: ${usuario.id ?? 0}`,{
          align: 'center'
        });
        doc.text(`ID cita: ${cita.idCita ?? 0}`,{
          align: 'center'
        });

       
        const row_servicios = []; 
        servicios.forEach(element => {
          const temp_list = [element.idServicio , element.nombre , element.precio];
          row_servicios.push(temp_list);
        })

        const table = {
          title: "servicios usados",
          headers:['id','nombre', 'precio'],
          rows: row_servicios,
          options: {
            divider:{
              horizontal:{disabled: true , with: 0.5 , opacity : 0.5}
            }
          }

        }
        doc.font('Helvetica');
        doc.moveDown();
        doc.moveDown();
        doc.table(table,{
          columnSize:[200,300,150],
          prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
          doc.font('Helvetica').fontSize(15);
          },
        })

        doc.moveDown();
        doc.font('Helvetica').fontSize(12);
        doc.text(`Sub total: $${factura.subtotal ?? 0}`,{
          align: 'center'
        });
        doc.text(`descuento: $${factura.descuento ?? 0}`,{
          align: 'center'
        });
        doc.moveDown();
        doc.fontSize(18);
        doc.text(`Total: $${factura.total ?? 0}`,{
          align: 'center'
        });
        doc.moveDown();
      
        const buffer = []
        doc.on('data', buffer.push.bind(buffer))
        doc.on('end', () => {
            const data = Buffer.concat(buffer)
            resolve(data)
        })
        doc.end()

      })

      return pdfBuffer;

    }


    
  // ─────────────────────────────────────────────
  // Métodos privados
  // ─────────────────────────────────────────────

  private buildFacturaResponse(factura: Factura) {
    const detallesServicios: DetalleItem[] = (factura.cita?.servicios ?? []).map((s) => ({
      descripcion: s.nombre,
      tipo: 'SERVICIO' as const,
      cantidad: 1,
      precio_unitario: s.precio,
      subtotal: s.precio,
    }));

    const detallesMedicamentos: DetalleItem[] = (factura.cita?.historiales ?? []).flatMap((h) =>
      (h.medicamentos ?? []).map((m) => ({
        descripcion: m.nombre,
        tipo: 'MEDICAMENTO' as const,
        cantidad: 1,
        precio_unitario: Number(m.producto?.precio ?? 0),
        subtotal: Number(m.producto?.precio ?? 0),
      })),
    );

    return {
      idFactura: factura.idFactura,
      subtotal: factura.subtotal,
      total: factura.total,
      descuento: factura.descuento,
      monto_pagado: factura.monto_pagado,
      estado: factura.estado,
      motivo_anulacion: factura.motivo_anulacion,
      citaId: factura.cita?.idCita,
      detalles: [...detallesServicios, ...detallesMedicamentos],
    };
  }
}
