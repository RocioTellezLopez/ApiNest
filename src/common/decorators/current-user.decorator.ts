import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorador personalizado para obtener el usuario actual desde la request.
 *
 * Este decorador extrae el usuario autenticado que normalmente está guardado
 * en `request.currentUser` o, si no existe, en `request.user`.
 * 
 * Se usa para inyectar el usuario en los controladores fácilmente.
 * 
 * @example
 * ```ts
 * @Get('profile')
 * getProfile(@CurrentUser() user: UserEntity) {
 *   return user;
 * }
 * ```
 *
 * @param data Parámetro opcional (no usado aquí).
 * @param ctx Contexto de ejecución que contiene la request.
 * @returns El objeto usuario obtenido de la request.
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.currentUser ?? request.user;
  },
);
