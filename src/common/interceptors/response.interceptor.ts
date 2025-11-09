import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { SUCCESS_MESSAGE_KEY } from '../decorators/success-message.decorator';

const REQUEST_SUCCESS_MESSAGE = 'Request successful';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpCtx = context.switchToHttp();
    const response = httpCtx.getResponse();
    const handler = context.getHandler();

    const customMessage = this.reflector.get<string>(
      SUCCESS_MESSAGE_KEY,
      handler,
    );

    return next.handle().pipe(
      map((result: any) => {
        const { results, meta } = result ?? {};

        return {
          message:
            customMessage || response.statusMessage || REQUEST_SUCCESS_MESSAGE,
          data: results ?? result,
          meta: meta ?? undefined,
          statusCode: response.statusCode,
          success: true,
        };
      }),
    );
  }
}
