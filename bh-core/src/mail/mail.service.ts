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
}
