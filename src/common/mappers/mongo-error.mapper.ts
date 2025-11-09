import {
  BadRequestException,
  ConflictException,
  GatewayTimeoutException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  Error as MongooseError,
  MongooseError as MongooseCoreError,
} from 'mongoose';

export class MongoErrorMapper {
  static toHttp(error: unknown): Error {
    const e = error as any;

    if (e instanceof HttpException) {
      return e;
    }

    // 1. Duplicado de clave única
    if (e?.code === 11000) {
      const fields = Object.keys(e.keyValue || {});
      const msg = `Duplicate key error: ${fields.join(', ')}`;
      return new ConflictException(msg);
    }

    // 2. Validación de esquema
    if (e instanceof MongooseError.ValidationError) {
      const messages = Object.values(e.errors).map((v: any) => v.message);
      return new BadRequestException(messages);
    }

    // 3. ID mal formado
    if (e instanceof MongooseError.CastError) {
      return new BadRequestException(`Invalid value for ${e.path}: ${e.value}`);
    }

    // 4. Problemas de conexión
    if (
      e.name === 'MongoNetworkError' ||
      e.name === 'MongooseServerSelectionError'
    ) {
      return new GatewayTimeoutException('Database connection error');
    }

    // 5. Otro error de Mongoose
    if (e instanceof MongooseCoreError) {
      return new InternalServerErrorException(e.message);
    }

    // 6. Fallback
    return new InternalServerErrorException('Unexpected database error');
  }
}
