import { SetMetadata } from '@nestjs/common';
import { rolEnum } from '../enums/rol.enum';

/**
 * Clave usada para almacenar metadata de roles en los endpoints.
 */
export const ROLES_KEY = 'roles';

/**
 * Decorador para asignar roles permitidos a un endpoint o controlador.
 * 
 * @param {...rolEnum[]} roles - Lista de roles permitidos para acceder.
 * @returns Un decorador que añade la metadata de roles.
 * 
 * @example
 * ```ts
 * @Roles(rolEnum.ADMIN, rolEnum.USER)
 * ```
 */
export const Roles = (...roles: rolEnum[]) => SetMetadata(ROLES_KEY, roles);
