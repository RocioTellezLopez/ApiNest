import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  InternalServerErrorException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    // Si es una excepción HTTP que lanzamos nosotros (400, 404, 409, etc.)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'string' ? res : (res as any).message;
      // const status = exception.getStatus();
      // const message = exception.getResponse();

      // return response.status(status).json({
      //   success: false,
      //   path: request.url,
      //   ...(typeof message === 'string' ? { message } : (message as object)),
      // });
    }
    console.error('Unhandled error:', exception);

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });

    // Si es un error inesperado (como un error de conexión o lógica rota)

    // response.status(500).json({
    //   success: false,
    //   path: request.url,
    //   message: 'Internal server error',
    // });
  }
}
