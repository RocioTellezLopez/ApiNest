import { Request } from 'express';
import { User } from '../../user/entities/user.entity';

/**
 * Extiende la interfaz `Request` de Express para incluir
 * la propiedad `user` con la información del usuario autenticado.
 * 
 * Esto facilita el tipado cuando accedes a `request.user` en controladores o guards.
 */
export interface RequestWithUser extends Request {
  /**
   * Usuario autenticado asociado a la request.
   */
  user: User;
}
