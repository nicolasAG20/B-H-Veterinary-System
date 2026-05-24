import {
  Body,
  Controller,
  Get,
  
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { HistorialMedicoService } from './historial-medico.service';
import { CreateHistorialMedicoDto } from './dto/create-historial-medico.dto';
import { UpdateHistorialMedicoDto } from './dto/update-historial-medico.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../usuario/entities/usuario.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class HistorialMedicoController {
  constructor(private readonly historialMedicoService: HistorialMedicoService) {}

  @Post('appointments/:appointmentId/medical-record')
  @Roles(RolUsuario.VETERINARIO)
  createMedicalRecord(
    @Param('appointmentId') appointmentId: string,
    @Body() dto: CreateHistorialMedicoDto,
    @Req() req: any,
  ) {
    return this.historialMedicoService.createMedicalRecord(
      +appointmentId,
      req.user.sub,
      dto,
    );
  }

  @Get('pets/:petId/medical-history')
  @Roles(RolUsuario.CLIENTE, RolUsuario.RECEPCIONISTA, RolUsuario.VETERINARIO)
  getPetMedicalHistory(@Param('petId') petId: string, @Req() req: any) {
    return this.historialMedicoService.getPetMedicalHistory(+petId, req.user);
  }

  @Get('medical-records/:recordId')
  @Roles(RolUsuario.CLIENTE, RolUsuario.RECEPCIONISTA, RolUsuario.VETERINARIO)
  getMedicalRecordById(@Param('recordId') recordId: string, @Req() req: any) {
    return this.historialMedicoService.getMedicalRecordById(+recordId, req.user);
  }

  @Put('medical-records/:recordId')
  @Roles(RolUsuario.VETERINARIO)
  updateMedicalRecord(
    @Param('recordId') recordId: string,
    @Body() dto: UpdateHistorialMedicoDto,
    @Req() req: any,
  ) {
    return this.historialMedicoService.updateMedicalRecord(
      +recordId,
      req.user.sub,
      dto,
    );
  }
}
