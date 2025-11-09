import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { rolEnum } from '../../common/enums/rol.enum';
import {
  MAX_ADMIN_LIMIT_KEY,
  MaxAdminLimitMetadata,
} from '../../common/decorators/max-admin-limit.decorator';
import { Admin } from '../../admin/entities/admin.entity';

@Injectable()
export class MaxAdminLimitGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>, // <-- usa Admin aquí
  ) {}

  /**
   * Verifica si se ha alcanzado el límite máximo de administradores de un tipo específico.
   * Si el límite se ha excedido, lanza un BadRequestException.
   *
   * @param context Contexto de ejecución
   * @returns True si la validación es exitosa
   * @throws BadRequestException Cuando se excede el límite permitido de admins
   */

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const limitMeta = this.reflector.get<MaxAdminLimitMetadata>(
      MAX_ADMIN_LIMIT_KEY,
      context.getHandler(),
    );
    if (!limitMeta) return true;

    const { typeAdmin, limit } = limitMeta;
    const req = context.switchToHttp().getRequest();
    const { rol, typeAdmin: incomingType } = req.body;

    if (rol === rolEnum.ADMIN && incomingType === typeAdmin) {
      const count = await this.adminModel.countDocuments({ typeAdmin });
      if (count >= limit) {
        throw new BadRequestException(
          `Solo se permiten ${limit} administradores del tipo ${typeAdmin}`,
        );
      }
    }

    return true;
  }
}
