import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HospitalizacionService } from './hospitalizacion.service';
import { CreateHospitalizacionDto } from './dto/create-hospitalizacion.dto';
import { UpdateHospitalizacionDto } from './dto/update-hospitalizacion.dto';

@Controller('hospitalizaciones')
export class HospitalizacionController {
  constructor(private readonly hospitalizacionService: HospitalizacionService) {}

  @Post()
  create(@Body() createHospitalizacionDto: CreateHospitalizacionDto) {
    return this.hospitalizacionService.create(createHospitalizacionDto);
  }

  @Get()
  findAll() {
    return this.hospitalizacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hospitalizacionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHospitalizacionDto: UpdateHospitalizacionDto) {
    return this.hospitalizacionService.update(+id, updateHospitalizacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hospitalizacionService.remove(+id);
  }
}
