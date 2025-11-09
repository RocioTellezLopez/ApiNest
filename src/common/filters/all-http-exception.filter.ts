import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MongoErrorMapper } from '../mappers/mongo-error.mapper';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Mapea errores de Mongo a HttpException si aplica
    const mapped =
      exception instanceof Error
        ? MongoErrorMapper.toHttp(exception)
        : exception;

    const status =
      (mapped as any).getStatus?.() ?? HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse =
      typeof (mapped as any).getResponse === 'function'
        ? (mapped as any).getResponse()
        : 'Internal server error';

    const message =
      typeof errorResponse === 'string'
        ? errorResponse
        : (errorResponse as any).message || 'Unexpected error';

    const error =
      typeof errorResponse === 'string'
        ? 'Error'
        : (errorResponse as any).error ||
          (exception instanceof Error ? exception.constructor.name : 'Error');

    response.status(status).json({
      statusCode: status,
      message,
      error,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
