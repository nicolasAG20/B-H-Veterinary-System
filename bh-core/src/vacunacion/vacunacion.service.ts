import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vacunacion } from './entities/vacunacion.entity';
import { CreateVacunacionDto } from './dto/create-vacunacion.dto';
import { UpdateVacunacionDto } from './dto/update-vacunacion.dto';

@Injectable()
export class VacunacionService {
  constructor(
    @InjectRepository(Vacunacion)
    private readonly vacunacionRepository: Repository<Vacunacion>,
  ) {}

  async create(createDto: CreateVacunacionDto) {
    const { historialMedicoId, productoId, ...rest } = createDto;
    const vacunacion = this.vacunacionRepository.create({
      ...rest,
      historialMedico: { idHistorial_medico: historialMedicoId } as any,
      producto: { idProducto: productoId } as any,
    });
    await this.vacunacionRepository.save(vacunacion);
    return { message: 'Vacunacion creada correctamente', vacunacion };
  }

  async findAll() {
    return this.vacunacionRepository.find({ relations: ['historialMedico', 'producto'] });
  }

  async findOne(id: number) {
    const vacunacion = await this.vacunacionRepository.findOne({
      where: { idVacunacion: id },
      relations: ['historialMedico', 'producto'],
    });
    if (!vacunacion) {
      throw new NotFoundException(`Vacunacion #${id} no encontrada`);
    }
    return vacunacion;
  }

  async update(id: number, updateDto: UpdateVacunacionDto) {
    await this.findOne(id);
    const { historialMedicoId, productoId, ...rest } = updateDto;
    const updateData: any = Object.fromEntries(
      Object.entries(rest).filter(([, v]) => v !== undefined),
    );
    if (historialMedicoId !== undefined) updateData.historialMedico = { idHistorial_medico: historialMedicoId };
    if (productoId !== undefined) updateData.producto = { idProducto: productoId };
    await this.vacunacionRepository.update(id, updateData);
    return { message: 'Vacunacion actualizada', vacunacion: await this.findOne(id) };
  }

    /**
   * Consulta las vacunas cuya proxima dosis esta dentro del rango indicado.
   *
   * Retorna la informacion necesaria para seguimiento: mascota, vacuna aplicada
   * y fecha de proxima dosis. Si no hay resultados, retorna un mensaje claro
   * para cumplir el caso sin resultados de la historia de usuario.
   *
   * @param dias - Cantidad de dias a futuro para considerar una vacuna proxima.
   */
  async findUpcoming(dias = 30) {
    const fechaInicio = new Date();
    fechaInicio.setHours(0, 0, 0, 0);

    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + dias);
    fechaFin.setHours(23, 59, 59, 999);

    const vacunaciones = await this.vacunacionRepository
      .createQueryBuilder('vacunacion')
      .leftJoinAndSelect('vacunacion.historialMedico', 'historialMedico')
      .leftJoinAndSelect('historialMedico.cita', 'cita')
      .leftJoinAndSelect('cita.mascota', 'mascota')
      .leftJoinAndSelect('vacunacion.producto', 'producto')
      .where('vacunacion.fecha_proxima_dosis BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio,
        fechaFin,
      })
      .orderBy('vacunacion.fecha_proxima_dosis', 'ASC')
      .addOrderBy('mascota.nombre', 'ASC')
      .getMany();

    if (vacunaciones.length === 0) {
      return {
        message: 'No hay vacunas proximas a vencer.',
        vacunaciones: [],
      };
    }

    return {
      message: 'Vacunas proximas a vencer consultadas exitosamente.',
      vacunaciones: vacunaciones.map((vacunacion) => ({
        idVacunacion: vacunacion.idVacunacion,
        nombre: vacunacion.nombre,
        fecha_aplicacion: vacunacion.fecha_aplicacion,
        fecha_proxima_dosis: vacunacion.fecha_proxima_dosis,
        mascota: vacunacion.historialMedico?.cita?.mascota
          ? {
              idMascota: vacunacion.historialMedico.cita.mascota.idMascota,
              nombre: vacunacion.historialMedico.cita.mascota.nombre,
              especie: vacunacion.historialMedico.cita.mascota.especie,
              raza: vacunacion.historialMedico.cita.mascota.raza,
            }
          : null,
        producto: vacunacion.producto
          ? {
              idProducto: vacunacion.producto.idProducto,
              nombre: vacunacion.producto.nombre,
            }
          : null,
      })),
    };
  }
  async remove(id: number) {
    await this.findOne(id);
    await this.vacunacionRepository.delete(id);
    return { message: 'Vacunacion eliminada correctamente' };
  }
}
