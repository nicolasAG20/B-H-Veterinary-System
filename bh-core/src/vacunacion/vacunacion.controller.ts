import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VacunacionService } from './vacunacion.service';
import { CreateVacunacionDto } from './dto/create-vacunacion.dto';
import { UpdateVacunacionDto } from './dto/update-vacunacion.dto';

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
