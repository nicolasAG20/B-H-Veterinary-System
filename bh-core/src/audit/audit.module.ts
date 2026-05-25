import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { HttpAuditClient } from './audit.service';
import { AUDIT_CLIENT } from './audit.types';

/**
 * Módulo encargado de proveer el cliente de auditoría a toda la aplicación.
 *
 * Se marca como `@Global` para evitar tener que importarlo manualmente en
 * cada módulo que necesite registrar eventos. Expone el token
 * `AUDIT_CLIENT`, que resuelve a la implementación HTTP por defecto.
 */
@Global()
@Module({
  imports: [
    HttpModule.register({
      timeout: 3000,
      maxRedirects: 0,
    }),
  ],
  providers: [
    HttpAuditClient,
    { provide: AUDIT_CLIENT, useExisting: HttpAuditClient },
  ],
  exports: [AUDIT_CLIENT],
})
export class AuditModule {}
