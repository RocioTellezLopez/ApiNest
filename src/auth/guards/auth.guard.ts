import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { rolEnum } from '../../common/enums/rol.enum';
import { AdminEnum } from '../../common/enums/admin-operation.enum';
import { AUTH_KEY, AuthMetadata } from '../../common/decorators/auth.decorator';

/**
 * Guard que controla el acceso según roles y permisos.
 *
 * Utiliza metadata definida con el decorador personalizado `@Auth()`
 * para obtener roles y permisos permitidos para el endpoint.
 *
 * - Verifica que el usuario esté autenticado.
 * - Valida que el rol del usuario esté dentro de los permitidos.
 * - Si se requieren permisos de admin, valida que el usuario los tenga.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  /**
   * Método principal que se ejecuta para decidir si se permite el acceso.
   *
   * @param context Contexto de ejecución, contiene la request HTTP.
   * @returns `true` si el usuario está autorizado, `false` si no.
   */
  canActivate(context: ExecutionContext): boolean {
    // Obtener roles y permisos desde metadata del decorador @Auth()
    const { roles, permissions } =
      this.reflector.getAllAndOverride<AuthMetadata>(AUTH_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || {};

    // Obtener el usuario desde la request
    const { user } = context.switchToHttp().getRequest();

    if (!user) return false;

    // Validar rol general
    if (roles && roles.length > 0 && !roles.includes(user.rol)) {
      return false;
    }

    // Validar permisos específicos de admin si aplica
    if (permissions && permissions.length > 0) {
      // Solo admins pueden tener permisos específicos
      if (user.rol !== rolEnum.ADMIN) return false;

      // Los permisos que tiene el admin
      const userPerms: AdminEnum[] = user.admin?.operatonPermise || [];

      // Verificar si tiene al menos uno de los permisos requeridos
      const hasPermission = permissions.some((p) => userPerms.includes(p));
      if (!hasPermission) return false;
    }

    return true;
  }
}
