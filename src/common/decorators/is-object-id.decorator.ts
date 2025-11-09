import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { Types } from 'mongoose';

export function IsObjectId(validationOptions?: ValidationOptions) {
  return function (target: Object, propertyName: string) {
    registerDecorator({
      name: 'IsObjectId',
      target: target.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (value === null || value === undefined) return true;

          if (Array.isArray(value)) {
            return value.every(
              (v) =>
                v instanceof Types.ObjectId ||
                (typeof v === 'string' && Types.ObjectId.isValid(v)),
            );
          }
          return (
            value instanceof Types.ObjectId ||
            (typeof value === 'string' && Types.ObjectId.isValid(value))
          );
        },

        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid Mongo ObjectId`;
        },
      },
    });
  };
}
