import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MedicamentoService } from './medicamento.service';
import { CreateMedicamentoDto } from './dto/create-medicamento.dto';
import { UpdateMedicamentoDto } from './dto/update-medicamento.dto';

@Controller('medicamentos')
export class MedicamentoController {
  constructor(private readonly medicamentoService: MedicamentoService) {}

  @Post()
  create(@Body() createMedicamentoDto: CreateMedicamentoDto) {
    return this.medicamentoService.create(createMedicamentoDto);
  }

  @Get()
  findAll() {
    return this.medicamentoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicamentoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMedicamentoDto: UpdateMedicamentoDto) {
    return this.medicamentoService.update(+id, updateMedicamentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicamentoService.remove(+id);
  }
}
