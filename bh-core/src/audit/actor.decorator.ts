import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ActorAuditoria, RolAuditoria } from './audit.types';

/**
 * Decorator que extrae al usuario autenticado desde el JWT y lo expone
 * como un objeto `ActorAuditoria` listo para ser usado al notificar
 * eventos al servicio bh-audit.
 *
 * Debe usarse en endpoints protegidos por `JwtAuthGuard`, ya que depende
 * de que el payload del token esté presente en `request.user`.
 *
 * @example
 * ```ts
 * @Patch(':id/approve')
 * aprobar(@Param('id') id: string, @Actor() actor: ActorAuditoria) {
 *   return this.usuarioService.aprobar(+id, actor);
 * }
 * ```
 */
export const Actor = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): ActorAuditoria => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return {
      id: Number(user?.sub),
      nombre: user?.nombre ?? 'desconocido',
      rol: user?.rol as RolAuditoria,
    };
  },
);
