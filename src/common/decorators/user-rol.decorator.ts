import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { rolEnum } from '../enums/rol.enum';

/**
 * Decorador para obtener el rol del usuario del contexto de ejecución.
 * Extrae el rol del usuario del objeto `user` en la solicitud.
 *
 * @returns {string} El rol del usuario
 */

export const UserRole = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return user?.rol as rolEnum;
  },
);
