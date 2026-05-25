import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards ,Res, ParseIntPipe } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../usuario/entities/usuario.entity';
import { PdfFacturaDto } from './dto/pdf-factura.dto';
import { pdfCitaDto } from './dto/pdf-cita.dto';
import { PdfService } from './pdf.service';


@UseGuards(JwtAuthGuard)
@Controller('reports')
export class PdfController {
    constructor(private readonly pdfService: PdfService) {}

    @Post('billing')
    @UseGuards(RolesGuard)
    @Roles(RolUsuario.ADMINISTRADOR)
    async downloadPDFRange(@Res() res , @Body() pdfFacturaDto :PdfFacturaDto): Promise<void>{
        
        const buffer = await this.pdfService.generarPDFFactura(pdfFacturaDto);
        res.set({
        'Content-Type' : 'application/pdf',
        'Content-Disposition' : 'attachment; filename=factura.pdf',
        'Content-Length' : buffer.length, 
        })
    
        res.end(buffer);
    }

    @Post('appointments')
    @UseGuards(RolesGuard)
    @Roles(RolUsuario.ADMINISTRADOR)
      async downloadPDFCita(@Res() res ,@Body() pdfCitaDto: pdfCitaDto): Promise<void>{
        
        const buffer = await this.pdfService.generarPDFCita(pdfCitaDto);
        res.set({
          'Content-Type' : 'application/pdf',
          'Content-Disposition' : 'attachment; filename=factura.pdf',
          'Content-Length' : buffer.length, 
        })
      
        res.end(buffer);
      }
    
      @Get('inventory')
      @UseGuards(RolesGuard)
      @Roles(RolUsuario.ADMINISTRADOR)
        async downloadPDFInventario(@Res() res ): Promise<void>{
          
          const buffer = await this.pdfService.generarPDFInventario();
          res.set({
            'Content-Type' : 'application/pdf',
            'Content-Disposition' : 'attachment; filename=factura.pdf',
            'Content-Length' : buffer.length, 
          })
        
          res.end(buffer);
        }
}