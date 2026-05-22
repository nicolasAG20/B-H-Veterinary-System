import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotaEvolucionService } from './nota-evolucion.service';
import { CreateNotaEvolucionDto } from './dto/create-nota-evolucion.dto';
import { UpdateNotaEvolucionDto } from './dto/update-nota-evolucion.dto';

@Controller('notas-evolucion')
export class NotaEvolucionController {
  constructor(private readonly notaEvolucionService: NotaEvolucionService) {}

  @Post()
  create(@Body() createNotaEvolucionDto: CreateNotaEvolucionDto) {
    return this.notaEvolucionService.create(createNotaEvolucionDto);
  }

  @Get()
  findAll() {
    return this.notaEvolucionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notaEvolucionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotaEvolucionDto: UpdateNotaEvolucionDto) {
    return this.notaEvolucionService.update(+id, updateNotaEvolucionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notaEvolucionService.remove(+id);
  }
}
