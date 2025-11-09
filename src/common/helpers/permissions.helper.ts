import { ForbiddenException } from '@nestjs/common';
import { rolEnum } from '../enums/rol.enum';

const MESSAGE_ERROR = {
  NO_PERMISSION_TO_MODIFY_RESOURCE:
    'No tienes permiso para modificar este recurso',
};

export class PermissionsHelper {
  static filterEditableFields(
    allowedFieldsConfig: Partial<Record<rolEnum, string[]>>,
    userRole: rolEnum,
    data: any,
  ): any {
    if (userRole === rolEnum.ADMIN) {
      return data;
    }

    const allowedFields = allowedFieldsConfig[userRole] ?? [];
    const invalidFields = Object.keys(data).filter(
      (key) => !allowedFields.includes(key),
    );

    if (invalidFields.length > 0) {
      throw new ForbiddenException(
        `No tienes permiso para modificar los campos: ${invalidFields.join(', ')}`,
      );
    }

    return Object.keys(data)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => ({ ...obj, [key]: data[key] }), {});
  }

  static validateOwnership(
    userId: any,
    resourceUserId: any,
    userRole: rolEnum,
  ) {
    const sameUser = userId?.toString() === resourceUserId?.toString();
    const isAdmin = userRole === rolEnum.ADMIN;

    if (!isAdmin && !sameUser) {
      throw new ForbiddenException(
        MESSAGE_ERROR.NO_PERMISSION_TO_MODIFY_RESOURCE,
      );
    }
  }
}
