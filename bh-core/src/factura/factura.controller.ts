import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards ,Res, ParseIntPipe } from '@nestjs/common';
import { Response } from 'express';
import { FacturaService } from './factura.service';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { AplicarDescuentoDto } from './dto/aplicar-descuento.dto';
import { AnularFacturaDto } from './dto/anular-factura.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../usuario/entities/usuario.entity';


@UseGuards(JwtAuthGuard)
@Controller('invoices')
export class FacturaController {
  constructor(private readonly facturaService: FacturaService) {}

  @Post()
  create(@Body() createFacturaDto: CreateFacturaDto) {
    return this.facturaService.create(createFacturaDto);
  }

  @Get()
  findAll() {
    return this.facturaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.facturaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFacturaDto: UpdateFacturaDto) {
    return this.facturaService.update(+id, updateFacturaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.facturaService.remove(+id);
  }

  @Patch(':id/cancel')
  @UseGuards(RolesGuard)
  @Roles(RolUsuario.RECEPCIONISTA)
  anularFactura(
    @Param('id') id: string,
    @Body() anularFacturaDto: AnularFacturaDto,
  ) {
    return this.facturaService.anularFactura(+id, anularFacturaDto);
  }

  @Patch(':id/discount')
  @UseGuards(RolesGuard)
  @Roles(RolUsuario.RECEPCIONISTA)
  aplicarDescuento(
    @Param('id') id: string,
    @Body() aplicarDescuentoDto: AplicarDescuentoDto,
  ) {
    return this.facturaService.aplicarDescuento(+id, aplicarDescuentoDto);
  }

  @Get(':id/pdf')
  @UseGuards(RolesGuard)
  @Roles(RolUsuario.CLIENTE , RolUsuario.ADMINISTRADOR)
  async downloadPDF(@Res() res ,@Param('id') id: string): Promise<void>{
    
    const buffer = await this.facturaService.generarPDF(+id);
    res.set({
      'Content-Type' : 'application/pdf',
      'Content-Disposition' : 'attachment; filename=factura.pdf',
      'Content-Length' : buffer.length, 
    })
  
    res.end(buffer);
  }

  


}
