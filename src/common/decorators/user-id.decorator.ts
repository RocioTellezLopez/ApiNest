import { createParamDecorator, ExecutionContext } from '@nestjs/common';
/**
 * Decorador para obtener el ID del usuario del contexto de ejecución.
 * Extrae el ID del usuario del objeto `user` en la solicitud.
 *
 * @returns {string} El ID del usuario
 */

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    // console.log('User ID decorator:', user); // trae todo la informacion de user
    const id= user?._id?.toString()
    
    return id; // si sub es el user._id del payload del JWT
  },
);
