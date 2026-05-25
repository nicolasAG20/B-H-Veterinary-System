import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res
} from '@nestjs/common';

import { CitaService } from './cita.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { CancelarCitaDto } from './dto/cancelar-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { EstimateCitaDto } from './dto/estimate-cita.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../usuario/entities/usuario.entity';
import { FacturaService } from '../factura/factura.service';
import { GenerarFacturaDto } from '../factura/dto/generar-factura.dto';
import { pdfCitaDto } from './dto/pdf-cita.dto';

/**
 * Controlador para la gestión de citas veterinarias.
 *
 * Expone los endpoints bajo el prefijo `/api/v1/appointments`.
 * Todos los endpoints requieren autenticación mediante JWT.
 */
@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class CitaController {
  constructor(
    private readonly citaService: CitaService,
    private readonly facturaService: FacturaService,
  ) {}

  /**
   * Estima el costo total de una cita a partir de los servicios seleccionados,
   * sin confirmar ni registrar la cita. Permite conocer el valor a pagar antes
   * de proceder con el agendamiento.
   *
   * @param estimateCitaDto - IDs de los servicios a incluir en la estimación.
   * @returns Total calculado y detalle de precios por servicio.
   */
  @Post('estimate')
  estimateCost(@Body() estimateCitaDto: EstimateCitaDto) {
    return this.citaService.estimateCost(estimateCitaDto);
  }

  /**
   * Agenda una nueva cita veterinaria con verificación de pago obligatoria.
   *
   * El sistema calcula el total a partir de los servicios seleccionados
   * y verifica que el monto pagado sea suficiente antes de confirmar el
   * agendamiento. Si el pago es aprobado, la cita queda en estado `AGENDADA`.
   *
   * @param createCitaDto - Datos de la cita incluyendo servicios y pago.
   * @returns Mensaje de confirmación y la cita creada.
   */
  @Post()
  create(@Body() createCitaDto: CreateCitaDto) {
    return this.citaService.create(createCitaDto);
  }

  /**
   * Retorna todas las citas registradas en el sistema.
   *
   * @returns Listado de citas con sus relaciones.
   */
  @Get()
  findAll() {
    return this.citaService.findAll();
  }

  /**
   * Retorna una cita específica por su ID.
   *
   * @param id - Identificador de la cita.
   * @returns Cita encontrada con sus relaciones.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.citaService.findOne(+id);
  }

  /**
   * Actualiza los datos de una cita existente.
   *
   * @param id - Identificador de la cita a actualizar.
   * @param updateCitaDto - Campos a modificar.
   * @returns Cita actualizada.
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCitaDto: UpdateCitaDto) {
    return this.citaService.update(+id, updateCitaDto);
  }

  @Patch(':id/cancelar')
  cancelar(
    @Param('id') id: string,
    @Body() cancelarCitaDto: CancelarCitaDto,
  ) {
    return this.citaService.cancelar(+id, cancelarCitaDto);
  }

  /**
   * Genera la factura de una cita finalizada con los servicios prestados
   * y medicamentos despachados. Solo accesible por la recepcionista.
   *
   * @param id - Identificador de la cita.
   * @param generarFacturaDto - Descuento opcional y medicamentos adicionales.
   * @returns Factura generada con el desglose de ítems y el total.
   */
  @Post(':id/invoice')
  @UseGuards(RolesGuard)
  @Roles(RolUsuario.RECEPCIONISTA)
  generarFactura(
    @Param('id') id: string,
    @Body() generarFacturaDto: GenerarFacturaDto,
  ) {
    return this.facturaService.generarFactura(+id, generarFacturaDto);
  }

  /**
   * Elimina una cita del sistema.
   *
   * @param id - Identificador de la cita a eliminar.
   * @returns Mensaje de confirmación.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.citaService.remove(+id);
  }

  @Post('pdfCitas')
  @Roles(RolUsuario.ADMINISTRADOR)
    async downloadPDF(@Res() res ,@Body() pdfCitaDto: pdfCitaDto): Promise<void>{
      
      const buffer = await this.citaService.generarPDF(pdfCitaDto);
      res.set({
        'Content-Type' : 'application/pdf',
        'Content-Disposition' : 'attachment; filename=factura.pdf',
        'Content-Length' : buffer.length, 
      })
    
      res.end(buffer);
    }
}
