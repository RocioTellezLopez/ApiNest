import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ObjectIdTransformPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value === null || value === undefined) return value;

    if (Buffer.isBuffer(value)) return value;

    if (Array.isArray(value)) {
      return value.map((v) => this.transform(v, metadata));
    }

    if (typeof value === 'object' && !(value instanceof Types.ObjectId)) {
      const transformed: Record<string, any> = {};
      for (const [key, val] of Object.entries(value)) {
        transformed[key] = this.transform(val, metadata);
      }
      return transformed;
    }

    if (typeof value === 'string' && this.isValidObjectId(value)) {
      return new Types.ObjectId(value);
    }

    return value;
  }

  private isValidObjectId(value: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(value);
  }
}
