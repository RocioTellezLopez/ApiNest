import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TypeAdminEnum } from '../common/enums/typeAdmin.enum';
import { rolEnum } from './../common/enums/rol.enum';
import { EnvConfiguration } from './../config/env.config';
import { Admin } from './entities/admin.entity';
import { AdminEnum } from 'src/common/enums/admin-operation.enum';
import { UserService } from 'src/user/user.service';

const MESSAGE_ERROR = {
  ADMIN_EXISTS: 'Admin already exists',
  ADMIN_NOT_FOUND: 'Admin not found',
  MAX_ADMIN_LIMIT: 'There can only be a maximum of 2 Main admins.',
  USER_NOT_CREATE: 'User could not be created',
};

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
    private readonly userServicie: UserService,
  ) {}

  async createMainAdminDefault() {
    const countAdmins = await this.adminModel.countDocuments({
      typeAdmin: TypeAdminEnum.MAIN,
    });

    console.log('countAdmins: ', countAdmins);

    if (countAdmins === 0) {
      const userAdminId = await this.userServicie.createUser(
        {
          fullName: EnvConfiguration().fullNameAdmin,
          email: EnvConfiguration().emailAdmin,
          password: EnvConfiguration().passwordAdmin,
          phoneNumber: EnvConfiguration().phoneNumberAdmin,
          rol: rolEnum.ADMIN,
          acceptTerms: [
            {
              termId: EnvConfiguration().termIdAdmin,
            },
          ],
        },
        rolEnum.ADMIN,
      );

      if (!userAdminId) {
        throw new BadRequestException(MESSAGE_ERROR.USER_NOT_CREATE);
      }

      const newAdminDefault = await this.adminModel.create({
        userId: userAdminId._id,
        name: 'Admin Main Default',
        typeAdmin: TypeAdminEnum.MAIN,
        operationPermise: [
          AdminEnum.CREATEUSER,
          AdminEnum.READUSER,
          AdminEnum.UPDATEUSER,
          AdminEnum.READMETRICS,
          AdminEnum.USERBLOKER,
          AdminEnum.INACTIVEUSER,
        ],
      });

      return newAdminDefault;
    }
  }

  async createMainAdmin(dto: CreateAdminDto) {
    const countAdmins = await this.adminModel.countDocuments({
      typeAdmin: TypeAdminEnum.MAIN,
    });

    if (countAdmins >= 2) {
      throw new BadRequestException(MESSAGE_ERROR.MAX_ADMIN_LIMIT);
    }

    const session = await this.adminModel.db.startSession();
    session.startTransaction();

    const userId = await this.userServicie.createUser(
      {
        fullName: dto.fullName,
        email: dto.email,
        password: dto.password,
        rol: rolEnum.ADMIN,
        phoneNumber: dto.phoneNumber,
        acceptTerms: dto.acceptTerms,
      },
      rolEnum.ADMIN,
      session,
    );

    if (!userId) {
      await session.abortTransaction();
      await session.endSession();
      throw new BadRequestException(MESSAGE_ERROR.USER_NOT_CREATE);
    }

    const newAdmin = await new this.adminModel({
      userId: userId._id,
      typeAdmin: TypeAdminEnum.MAIN,
      operationPermise: dto.operationPermise,
    }).save({ session });

    await session.commitTransaction();
    await session.endSession();

    console.log('Admin creado:', userId.email);

    return {
      user: userId,
      admin: newAdmin,
    };
  }

  async createAgents(dto: CreateAdminDto) {
    const session = await this.adminModel.db.startSession();
    session.startTransaction();

    const userId = await this.userServicie.createUser(
      {
        fullName: dto.fullName,
        email: dto.email,
        password: dto.password,
        rol: rolEnum.ADMIN,
        phoneNumber: dto.phoneNumber,
        acceptTerms: dto.acceptTerms,
      },
      rolEnum.ADMIN,
      session,
    );
    if (!userId) {
      await session.abortTransaction();
      await session.endSession();
      throw new BadRequestException(MESSAGE_ERROR.USER_NOT_CREATE);
    }
    const newAdminAgents = await new this.adminModel({
      userId: userId._id,
      typeAdmin: TypeAdminEnum.AGENTS,
      operationPermise: dto.operationPermise,
    }).save({ session });

    await session.commitTransaction();
    await session.endSession();

    return {
      user: userId,
      admin: newAdminAgents,
    };
  }

  async getAdmins() {
    const admins = await this.adminModel
      .find()
      .populate({ path: 'userId', select: '-password' });
    return admins;
  }

  async getProfileAdminByUserId(userId: string) {
    const admin = await this.adminModel.findOne({ userId: userId });

    if (!admin) {
      throw new BadRequestException(MESSAGE_ERROR.ADMIN_NOT_FOUND);
    }
    return admin;
  }

  async getAdminById(id: string) {
    const admin = await this.adminModel.findById(id);
    if (!admin) {
      throw new BadRequestException(MESSAGE_ERROR.ADMIN_NOT_FOUND);
    }
    return admin;
  }

  async deleteAdminAgents(id: string, typeAdmin: string) {
    if (typeAdmin === TypeAdminEnum.AGENTS) {
      throw new BadRequestException(
        'Agent admins cannot be deleted, only deactivated.',
      );
    }

    const adminDeleted = await this.adminModel.findByIdAndDelete(id);
    if (!adminDeleted) {
      throw new BadRequestException(MESSAGE_ERROR.ADMIN_NOT_FOUND);
    }
    const userDeleted = await this.userServicie.deleteUser(
      adminDeleted.userId.toString(),
    );
    if (!userDeleted) {
      throw new BadRequestException(MESSAGE_ERROR.USER_NOT_CREATE);
    }

    return adminDeleted._id;
  }
}
