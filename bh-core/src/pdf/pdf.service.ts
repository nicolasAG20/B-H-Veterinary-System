import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, Between , LessThanOrEqual} from 'typeorm';
import { Factura } from 'src/factura/entities/factura.entity';
import { Cita, EstadoCita } from '../cita/entities/cita.entity';
import { Producto } from '../producto/entities/producto.entity';
import { Cliente } from '../cliente/entities/cliente.entity';
import { pdfCitaDto } from './dto/pdf-cita.dto';
import { PdfFacturaDto } from './dto/pdf-factura.dto';
import { PdfHistorialAccionesDto } from './dto/pdf-historial-acciones.dto';
import { resolve } from 'path';
import { timeout } from 'rxjs';
import { Vacunacion } from 'src/vacunacion/entities/vacunacion.entity';
import { AUDIT_CLIENT, IAuditClient } from '../audit/audit.types';

const PDFDocument = require('pdfkit-table');

@Injectable()
export class PdfService {
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

  /**
   * Genera el reporte PDF del historial de acciones consultando bh-audit
   * con los filtros indicados.
   *
   * @param dto filtros opcionales (tipo de acción, usuario, rol, rango de fechas).
   * @returns buffer del PDF listo para ser enviado al cliente.
   * @throws BadRequestException si la fecha de inicio es posterior a la final.
   * @throws NotFoundException si no existen eventos que cumplan los filtros.
   */
  async generarPDFHistorialAcciones(
    dto: PdfHistorialAccionesDto,
  ): Promise<Buffer> {
    if (
      dto.fechaInicio &&
      dto.fechaFin &&
      new Date(dto.fechaInicio) > new Date(dto.fechaFin)
    ) {
      throw new BadRequestException(
        'La fecha de inicio es mayor a la fecha final',
      );
    }

    const eventos = await this.auditClient.consultarEventos({
      tipo_accion: dto.tipo_accion,
      usuarioId: dto.usuarioId,
      rol: dto.rol,
      fechaInicio: dto.fechaInicio,
      fechaFin: dto.fechaFin,
    });

    if (!eventos.length) {
      throw new NotFoundException(
        'No existen eventos de auditoría con los filtros indicados',
      );
    }

    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        size: 'LETTER',
        bufferPages: true,
        autoFirstPage: false,
      });

      doc.addPage();
      doc.fontSize(24);
      doc.text('BH Veterinaria', { align: 'center' });
      doc.fontSize(14);
      doc.text('Reporte historial de acciones', { align: 'center' });
      doc.fontSize(10);
      doc.moveDown();

      doc.fontSize(11);
      doc.text(`Total de acciones: ${eventos.length}`);
      doc.text(`Tipo de acción: ${dto.tipo_accion ?? 'Todos'}`);
      doc.text(`Rol: ${dto.rol ?? 'Todos'}`);
      doc.text(`Usuario: ${dto.usuarioId ?? 'Todos'}`);
      doc.text(`Fecha inicio: ${dto.fechaInicio ?? 'Sin filtro'}`);
      doc.text(`Fecha fin: ${dto.fechaFin ?? 'Sin filtro'}`);
      doc.moveDown();

      const filas = eventos.map((evento) => [
        evento.id,
        evento.tipo_accion,
        evento.nombre_usuario,
        evento.rol,
        new Date(evento.fecha_hora).toLocaleString('es-CO'),
      ]);

      const tabla = {
        title: 'Acciones registradas:',
        headers: ['ID', 'Tipo de acción', 'Usuario', 'Rol', 'Fecha y hora'],
        rows: filas,
        options: {
          divider: {
            horizontal: { disabled: true, with: 0.5, opacity: 0.5 },
          },
        },
      };

      doc.font('Helvetica');
      doc.moveDown();
      doc.table(tabla, {
        columnSize: [50, 150, 130, 90, 160],
        padding: 6,
        prepareRow: () => {
          doc.font('Helvetica').fontSize(9);
        },
      });

      doc.moveDown();

      const buffer: Buffer[] = [];
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', () => {
        const data = Buffer.concat(buffer);
        resolve(data);
      });
      doc.end();
    });

    return pdfBuffer;
  }


  async generarPDFFactura(dto: PdfFacturaDto): Promise<Buffer>{

          const { fecha_inicio , fecha_fin  } = dto;
          if(new Date(fecha_inicio)> new Date(fecha_fin)){
            throw new BadRequestException(`la fecha de inicio es mayor a la del final`);
          }
          const facturas = await this.facturaRepository.find({
          where: { 
          fecha_creacion: Between(new Date(fecha_inicio), new Date(fecha_fin)) 
        },  
          relations: [
            'cita',
          ],
        });
          
    
        if (!facturas.length) {
          throw new NotFoundException(`no existen facturas en ese rango de fechas`);
        }
        
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
            doc.text("Reporte facturas " ,{
              align: 'center'
            }); 
            doc.fontSize(10);
            doc.moveDown();
       
            const row_facturas= []; 
            let sumaTotal = 0;
            
            facturas.forEach(element => {
              sumaTotal += element.total ?? 0;
              const temp_list = [element.idFactura , element.descuento , element.estado];
              row_facturas.push(temp_list);
            })
    
            const table = {
              title: "Facturas:",
              headers:['Id','Descuento', 'Estado'],
              rows: row_facturas,
              options: {
                divider:{
                  horizontal:{disabled: true , with: 0.5 , opacity : 0.5}
                }
              }
    
            }
            doc.font('Helvetica');
            doc.moveDown();
            doc.moveDown();
            doc.fontSize(12);
            doc.text(`Total facturas: ${facturas.length}`); 
            doc.text(`Total facturado: ${sumaTotal}`); 
             
            doc.table(table,{
              columnSize:[200,300,150],
              prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
              doc.font('Helvetica').fontSize(15);
              },
            })
    
            doc.moveDown();
            doc.font('Helvetica').fontSize(12);
          
            
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

   async generarPDFCita(dto: pdfCitaDto): Promise<Buffer>{
      const { fecha_inicio , fecha_fin  } = dto;
      if(new Date(fecha_inicio)> new Date(fecha_fin)){
        throw new BadRequestException(`la fecha de inicio es mayor a la del final`);
      }
      const citas = await this.citaRepository.find({
      where: { 
      fecha_hora: Between(new Date(fecha_inicio), new Date(fecha_fin)) 
    },  
      relations: [
        'servicios',
        'usuario',
        'mascota',
        'mascota.cliente',         
        'mascota.cliente.usuario',
        'historiales',
        'historiales.medicamentos',
        'historiales.medicamentos.producto',
      ],
    });
      

    if (!citas.length) {
      throw new NotFoundException(`no existen citas en ese rango de fechas`);
    }
    
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
        doc.text("Reporte citas " ,{
          align: 'center'
        }); 
        doc.fontSize(10);
         doc.moveDown();
        
        
        doc.moveDown();
        doc.fontSize(12);
        

       
        const row_citas= []; 
        citas.forEach(element => {
          const clienteNombre = element.mascota.cliente.usuario.nombre;
          const nombreMascota = element.mascota.nombre;
          const nombreVeterinario =element.usuario.nombre;
          const temp_list = [clienteNombre , nombreMascota , nombreVeterinario , element.estado];
          row_citas.push(temp_list);
        })

        const table = {
          title: "citas:",
          headers:['Cliente','Mascota', 'nombreVeterinario', 'estado'],
          rows: row_citas,
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
       /* doc.text(`Sub total: $${factura.subtotal ?? 0}`,{
          align: 'center'
        });*/
        
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

  async generarPDFInventario(): Promise<Buffer>{

      const productos = await this.productoRepository.find();

    const productosStockBajo = await this.productoRepository
    .createQueryBuilder('producto')
    .where('producto.stock <= producto.stock_minimo') 
    .getMany();

    const fechaActual = new Date();
    const productosAVencer = await this.productoRepository 
    .createQueryBuilder('producto')
    .where('producto.fecha_vencimiento <= :hoy', { hoy: fechaActual })
    .getMany();


      

      const pdfBuffer: Buffer = await new Promise( resolve => {
        const doc = new PDFDocument(
          {
            size: "LETTER" , 
            bufferPages: true ,
            autoFirstPage : false
          }
        )

        const row_productos= []; 
        productos.forEach(element => {
                const temp_list = [element.idProducto ,element.stock , element.precio , element.fecha_vencimiento ];
          row_productos.push(temp_list);
        })

        const row_productosLowStock = [];
        productosStockBajo.forEach(element => {
                const temp_list = [element.idProducto ,element.stock , element.precio , element.fecha_vencimiento ];
          row_productosLowStock.push(temp_list);
        })

        const row_productosAVencer = [];
        productosAVencer.forEach(element => {
                const temp_list = [element.idProducto ,element.stock , element.precio , element.fecha_vencimiento ];
          row_productosAVencer.push(temp_list);
        })
        doc.addPage(); 
        doc.fontSize(24);
        doc.text("BH Veterinaria" ,{
          align: 'center'
        }); 
        doc.fontSize(14);
        doc.text("Reporte inventario " ,{
          align: 'center'
        }); 
        doc.fontSize(10);
         doc.moveDown();
        
        
        doc.moveDown();
        doc.fontSize(12);
        

        const table = {
          title: "productos:",
          headers:['id','stock', 'precio', 'fecha de vencimiento'],
          rows: row_productos,
          options: {
            divider:{
              horizontal:{disabled: true , with: 0.5 , opacity : 0.5}
            }
          }
        }
          const tableAviso = {
          title: "ADVERTENCIA de productos:",
          subtitle: "prductos que tiene bajo stock o están vencidos",
          headers:['id','stock', 'precio', 'fecha de vencimiento'],
          rows: [...row_productosAVencer, ...row_productosLowStock],
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
          columnSize:[200,300,150,100],
          padding: 10,     
          prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
          doc.font('Helvetica').fontSize(8);
          },
        })


        doc.moveDown();
        doc.table(tableAviso,{
          columnSize:[200,300,150,100],
          padding: 10,     
          prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
          doc.font('Helvetica').fontSize(8);
          },
        })
        doc.font('Helvetica').fontSize(12);
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

}