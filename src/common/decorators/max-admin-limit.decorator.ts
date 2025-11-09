import { SetMetadata } from '@nestjs/common';
import { TypeAdminEnum } from '../enums/typeAdmin.enum';

/**
 * Clave usada para almacenar metadata de límite máximo de admins en endpoints.
 */
export const MAX_ADMIN_LIMIT_KEY = 'maxAdminLimit';

/**
 * Metadata para configurar el límite máximo de admins permitidos por tipo.
 * 
 * @property {TypeAdminEnum} typeAdmin - Tipo de admin al que aplica el límite.
 * @property {number} limit - Cantidad máxima permitida.
 */
export interface MaxAdminLimitMetadata {
  typeAdmin: TypeAdminEnum;
  limit: number;
}

/**
 * Decorador para establecer un límite máximo de admins por tipo en un endpoint o controlador.
 * 
 * @param {TypeAdminEnum} typeAdmin - Tipo de admin para el límite.
 * @param {number} limit - Cantidad máxima de admins permitidos.
 * @returns Un decorador que añade la metadata al endpoint/controlador.
 * 
 * @example
 * ```ts
 * @MaxAdminLimit(TypeAdminEnum.SUPERADMIN, 5)
 * ```
 */
export const MaxAdminLimit = (typeAdmin: TypeAdminEnum, limit: number) =>
  SetMetadata(MAX_ADMIN_LIMIT_KEY, { typeAdmin, limit });
