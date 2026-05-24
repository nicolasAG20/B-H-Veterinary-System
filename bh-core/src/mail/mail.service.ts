import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

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

  async enviarCodigoVerificacion(correo: string, codigo: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.configService.get<string>('MAIL_FROM'),
      to: correo,
      subject: 'Código de verificación - B&H Veterinary System',
      html: `<p>Tu código de verificación es: <strong>${codigo}</strong>. Expira en 15 minutos.</p>`,
    });
  }

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
}
