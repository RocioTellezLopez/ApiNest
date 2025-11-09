import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../common/decorators/roles.decorator';
import { AdminEnum } from '../../common/enums/admin-operation.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  /**
  * @param {Reflector} reflector - Servicio para leer metadatos personalizados
  */
  constructor(private reflector: Reflector) { }

  /**
 * Verifica si el usuario tiene al menos uno de los permisos requeridos para acceder al recurso.
 * 
 * - Obtiene los permisos requeridos desde el decorador `@Roles()`
 * - Valida que el usuario esté autenticado y tenga rol "admin"
 * - Comprueba si el usuario tiene alguno de los permisos requeridos
 * 
 * @param {ExecutionContext} context - Contexto de ejecución de la petición
 * @returns {boolean} True si el usuario tiene permisos necesarios o no se requieren permisos; false en otro caso
 */

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<AdminEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // No se requieren permisos específicos
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || user.rol !== 'admin') {
      return false;
    }

    // Si el user ya tiene el admin cargado (populate), accede directamente
    const userPermissions: AdminEnum[] = user.admin?.operatonPermise || [];

    // Si no está populateado, puedes intentar acceder directo
    // const userPermissions = user.operatonPermise || [];

    return requiredPermissions.some((perm) => userPermissions.includes(perm));
  }
}
