import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../../user/entities/user.entity';
import { Admin } from '../../admin/entities/admin.entity';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string | null => {
          if (req?.cookies?.['access-token']) {
            return req.cookies['access-token'];
          }
          return null;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'admin-key',
    });
  }

  async validate(payload: any) {
    if (!Types.ObjectId.isValid(payload.sub)) {
      throw new UnauthorizedException('ID inválido en el token');
    }

    const user = await this.userModel.findById(payload.sub).lean();
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    if (user.rol === 'admin') {
      const admin = await this.adminModel.findOne({ userId: user._id }).lean();
      if (!admin) throw new UnauthorizedException('Admin no encontrado');

      user['admin'] = {
        typeAdmin: admin.typeAdmin,
        operationPermise: admin.operationPermise,
      };
    }

    return user;
  }
}
