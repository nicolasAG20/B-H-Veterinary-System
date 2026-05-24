import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  /** Instancia del transporter de Nodemailer configurada con las credenciales SMTP del entorno. */
  private transporter: nodemailer.Transporter;

  /**
   * Inicializa el transporter de Nodemailer con la configuración SMTP
   * definida en las variables de entorno (MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS).
   *
   * @param configService - Servicio de configuración de NestJS para leer variables de entorno.
   */
  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  /**
   * Envía un correo con el código de verificación al usuario recién registrado.
   * El código expira en 15 minutos.
   *
   * @param correo - Dirección de correo del destinatario.
   * @param codigo - Código de verificación de 6 caracteres generado por el sistema.
   */
  async enviarCodigoVerificacion(correo: string, codigo: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.configService.get<string>('MAIL_FROM'),
      to: correo,
      subject: 'Código de verificación - B&H Veterinary System',
      html: `<p>Tu código de verificación es: <strong>${codigo}</strong>. Expira en 15 minutos.</p>`,
    });
  }

  /**
   * Envía un correo al cliente confirmando que el pago de la cita fue procesado exitosamente.
   * Incluye el listado de servicios contratados y el monto total pagado.
   *
   * @param correoCliente - Dirección de correo del cliente.
   * @param montoPagado - Monto pagado en pesos colombianos.
   * @param nombresServicios - Lista de nombres de los servicios incluidos en la cita.
   */
  async enviarConfirmacionPago(
    correoCliente: string,
    montoPagado: number,
    nombresServicios: string[],
  ): Promise<void> {
    const serviciosHtml = nombresServicios
      .map((nombre) => `<li>${nombre}</li>`)
      .join('');

    await this.transporter.sendMail({
      from: this.configService.get<string>('MAIL_FROM'),
      to: correoCliente,
      subject: 'Confirmación de pago - B&H Veterinary System',
      html: `
        <h2>¡Tu pago fue procesado exitosamente!</h2>
        <p><strong>Servicios contratados:</strong></p>
        <ul>${serviciosHtml}</ul>
        <p><strong>Monto pagado:</strong> $${montoPagado.toLocaleString('es-CO')}</p>
      `,
    });
  }

  /**
   * Envía un correo al cliente con los detalles de la cita agendada:
   * nombre de la mascota, fecha y hora, veterinario asignado, dirección
   * de la sede y recordatorio de llegar 10 minutos antes.
   *
   * @param correoCliente - Dirección de correo del cliente.
   * @param nombreMascota - Nombre de la mascota que será atendida.
   * @param fechaHora - Fecha y hora de la cita (Date o string ISO).
   * @param nombreVeterinario - Nombre completo del veterinario asignado.
   */
  async enviarInformacionCita(
    correoCliente: string,
    nombreMascota: string,
    fechaHora: Date | string,
    nombreVeterinario: string,
  ): Promise<void> {
    const fechaObj = new Date(fechaHora);
    const fecha = fechaObj.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const hora = fechaObj.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
    });

    await this.transporter.sendMail({
      from: this.configService.get<string>('MAIL_FROM'),
      to: correoCliente,
      subject: 'Información de tu cita - B&H Veterinary System',
      html: `
        <h2>¡Tu cita ha sido agendada!</h2>
        <p><strong>Mascota:</strong> ${nombreMascota}</p>
        <p><strong>Fecha:</strong> ${fecha}</p>
        <p><strong>Hora:</strong> ${hora}</p>
        <p><strong>Veterinario:</strong> ${nombreVeterinario}</p>
        <p><strong>Dirección:</strong> Calle 123 # 45-67, Bogotá</p>
        <br/>
        <p>⏰ Recuerda llegar <strong>10 minutos antes</strong> de tu cita.</p>
      `,
    });
  }
}
