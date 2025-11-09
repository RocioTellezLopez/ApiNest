import { SetMetadata } from '@nestjs/common';
import { rolEnum } from '../enums/rol.enum';
import { AdminEnum } from '../enums/admin-operation.enum';

/**
 * Clave usada para almacenar metadata de autorización en los endpoints.
 */
export const AUTH_KEY = 'auth';

/**
 * Interfaz que define la metadata para autorización.
 * 
 * @property {rolEnum[]} [roles] - Array opcional de roles permitidos para acceder.
 * @property {AdminEnum[]} [permissions] - Array opcional de permisos específicos requeridos (usualmente para admins).
 */
export interface AuthMetadata {
  roles?: rolEnum[];
  permissions?: AdminEnum[];
}

/**
 * Decorador personalizado para asignar metadata de autorización a rutas o controladores.
 * Usa `SetMetadata` para guardar los roles y permisos necesarios bajo la clave `AUTH_KEY`.
 * 
 * @param {AuthMetadata} options - Opciones con roles y/o permisos requeridos para el endpoint.
 * @returns Un decorador que se usa para proteger rutas con roles y permisos específicos.
 * 
 * @example
 * ```ts
 * @Auth({ roles: [rolEnum.ADMIN], permissions: [AdminEnum.CREATE_USER] })
 * ```
 */
export const Auth = (options: AuthMetadata) => SetMetadata(AUTH_KEY, options);
