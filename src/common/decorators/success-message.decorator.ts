import { SetMetadata } from '@nestjs/common';

export const SUCCESS_MESSAGE_KEY = 'successMessage';

/**
 * Decorador para definir un mensaje de éxito personalizado
 * en las respuestas de un endpoint.
 *
 * @param message Mensaje de éxito que se devolverá en la respuesta
 */
export const SuccessMessage = (message: string) =>
  SetMetadata(SUCCESS_MESSAGE_KEY, message);