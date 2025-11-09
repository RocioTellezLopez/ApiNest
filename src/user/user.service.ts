import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { BcryptService } from '../common/utils/bcrypt.service';
import { rolEnum } from '../common/enums/rol.enum';

import { stateUserEnum } from '../common/enums/stateUser.enum';
import { Types } from 'mongoose';

const MESSAGE_ERROR = {
  DUPLICATE_KEY: 'There is already a user with this email',
  BAD_REQUEST: 'Bad request error in the request validation',
  NOT_FOUND: 'User or client not found',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  UNAUTHORIZED_ADMIN:
    'You do not have permission to update the user role to ADMIN',
  FORBIDDEN: 'You do not have permission to perform this action',
  NOT_CREATED_USER: 'User not created',
  NOT_CREATED_ClIENT: 'Client not created, enter the correct data',
  NOT_CHANGED_ROLE_ADMIN: 'Not changed role admin',
  NOT_CHANGED_ROLE_RECENTLY:
    'El rol ha sido actualizado recientemente al actual.',
  NOT_CUSTOMER_ID: 'User does not have a customerId',
};

const MESSAGE_SUCCESS = {
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  USER_FOUND: 'User found successfully',
  USER_ROLE_CHANGED: 'User role changed successfully',
};

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    private readonly bcryptService: BcryptService,
  ) {}

  async createUser(
    dto: CreateUserDto,
    role: rolEnum = rolEnum.CLIENTFINAL,
    session?: any,
  ) {
    const userExist = await this.UserModel.exists({ email: dto.email }).session(
      session || null,
    );
    if (userExist) {
      throw new ConflictException(MESSAGE_ERROR.DUPLICATE_KEY);
    }
    const hashedPassword = await this.bcryptService.hashPassword(dto.password);

    const newUser = await new this.UserModel({
      ...dto,
      password: hashedPassword,
      rol: role,
    }).save({ session });

    const { password, ...result } = newUser.toObject();

    return result;
  }
  async findByEmail(email: string) {
    const user = await this.UserModel.findOne({ email }).select('+password');
    if (!user) {
      throw new NotFoundException(MESSAGE_ERROR.NOT_FOUND);
    }
    return user;
  }

  async blockUser(id: string, reason: string) {
    const user = await this.UserModel.findByIdAndUpdate(id, {
      stateUser: stateUserEnum.BLOCKED,
      isBlocked: true,
      $push: {
        blockedReasons: {
          reason,
        },
      },
    });

    if (!user) {
      throw new NotFoundException(MESSAGE_ERROR.NOT_FOUND);
    }
    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.UserModel.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  async getPerfileUser(id: string) {
    const user = await this.UserModel.findById(id).select('-password');
    if (!user) {
      throw new NotFoundException(MESSAGE_ERROR.NOT_FOUND);
    }
    return user;
  }

  async addTermsCondition(userId: string, termId: string) {
    const userWithTerms = await this.UserModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          acceptTerms: {
            termId: new Types.ObjectId(termId),
            acceptedAt: new Date(),
          },
        },
      },
      { new: true },
    );

    return userWithTerms;
  }

  async removeTermsCondition(termId: string) {
    const removedTerms = await this.UserModel.updateMany(
      { 'acceptTerms.termId': termId },
      {
        $set: {
          acceptTerms: { termId: null, acceptedAt: null, _id: null },
        },
      },
    );
    return removedTerms;
  }

  async deleteUser(id: string) {
    const userDeleted = await this.UserModel.findByIdAndDelete(id);
    if (!userDeleted) {
      throw new NotFoundException(MESSAGE_ERROR.NOT_FOUND);
    }
    return userDeleted;
  }

  async findIdsByFilter(filter: any) {
    const docs = await this.UserModel.find(filter).select('_id');

    return docs.map((doc) => doc._id);
  }
}
