import {Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards,} from '@nestjs/common';
import { ServicioService } from './servicio.service';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { ListServiciosQueryDto } from './dto/list-servicios-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../usuario/entities/usuario.entity';

@Controller('servicios')
export class ServicioController {
  constructor(private readonly servicioService: ServicioService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR)
  create(@Body() createServicioDto: CreateServicioDto) {
    return this.servicioService.create(createServicioDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() query: ListServiciosQueryDto) {
    return this.servicioService.findAll(query.activo);
  }

  @Get(':serviceId')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('serviceId', ParseIntPipe) serviceId: number) {
    return this.servicioService.findOne(serviceId);
  }

  @Put(':serviceId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR)
  update(
    @Param('serviceId', ParseIntPipe) serviceId: number,
    @Body() updateServicioDto: UpdateServicioDto,
  ) {
    return this.servicioService.update(serviceId, updateServicioDto);
  }

  @Patch(':serviceId/deactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR)
  deactivate(@Param('serviceId', ParseIntPipe) serviceId: number) {
    return this.servicioService.deactivate(serviceId);
  }
}
