import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { VacunacionService } from './vacunacion.service';
import { CreateVacunacionDto } from './dto/create-vacunacion.dto';
import { UpdateVacunacionDto } from './dto/update-vacunacion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../usuario/entities/usuario.entity';
import { ListUpcomingVaccinationsDto } from './dto/list-upcoming-vaccinations.dto';

@Controller('vacunaciones')
export class VacunacionController {
  constructor(private readonly vacunacionService: VacunacionService) {}

  @Post()
  create(@Body() createVacunacionDto: CreateVacunacionDto) {
    return this.vacunacionService.create(createVacunacionDto);
  }

  @Get()
  findAll() {
    return this.vacunacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vacunacionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVacunacionDto: UpdateVacunacionDto) {
    return this.vacunacionService.update(+id, updateVacunacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vacunacionService.remove(+id);
  }

}
  /**
 * Controlador para consultas de vacunacion alineadas con open-api.yml.
 *
 * Expone la ruta GET /api/v1/vaccinations/upcoming para que veterinarios
 * y recepcionistas consulten mascotas con vacunas proximas a vencer.
 */
@Controller('vaccinations')
export class UpcomingVaccinationController {
  constructor(private readonly vacunacionService: VacunacionService) {}

  /**
   * Lista las vacunas cuya proxima dosis esta cerca de vencerse.
   *
   * @param query - Parametro opcional dias. Por defecto consulta 30 dias.
   */
  @Get('upcoming')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.VETERINARIO, RolUsuario.RECEPCIONISTA)
  findUpcoming(@Query() query: ListUpcomingVaccinationsDto) {
    return this.vacunacionService.findUpcoming(query.dias ?? 30);
  }
}
