import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClientFinalDto } from './dto/create-client-final.dto';
import { UpdateClientFinalDto } from './dto/update-client-final.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ClientFinal } from './entities/client-final.entity';
import { Model, Types } from 'mongoose';
import { UserService } from './../user/user.service';

const MESSAGE_ERROR = {
  CLIENT_FINAL_EXIST: 'Client already exists',
  CLIENT_NOT_FOUND: 'Client not found',
  USER_NOT_CREATED: 'User not created',
  CLIENT_NOT_UPDATE: 'Client not updated',
};

@Injectable()
export class ClientFinalService {
  constructor(
    @InjectModel(ClientFinal.name) private clientFinal: Model<ClientFinal>,
    @Inject(forwardRef(() => UserService))
    private readonly userServicie: UserService,
  ) {}
  async create(createClientFinalDto: CreateClientFinalDto) {
    const session = await this.clientFinal.db.startSession();
    session.startTransaction();

    const userId = await this.userServicie.createUser(
      createClientFinalDto,
      createClientFinalDto.rol,
    );

    if (!userId) {
      await session.abortTransaction();
      await session.endSession();
      throw new ConflictException(MESSAGE_ERROR.USER_NOT_CREATED);
    }

    const newClientFinal = await new this.clientFinal({
      userId: userId._id,
      ...createClientFinalDto,
    }).save({ session });

    await session.commitTransaction();
    await session.endSession();

    return {
      user: userId,
      client: newClientFinal,
    };
  }

  async getProfileByUserId(userId: string) {
    const client = await this.clientFinal.findOne({ userId: userId });

    if (!client) {
      throw new NotFoundException(MESSAGE_ERROR.CLIENT_NOT_FOUND);
    }
    return client;
  }

  async update(id: string, updateClientFinalDto: UpdateClientFinalDto) {
    const clientUpdeted = await this.clientFinal.findByIdAndUpdate(
      id,
      updateClientFinalDto,
      { new: true },
    );

    console.log('id:', id, ' updateClientFinalDto:', updateClientFinalDto);

    if (!clientUpdeted) {
      throw new Error(MESSAGE_ERROR.CLIENT_NOT_UPDATE);
    }

    return clientUpdeted;
  }

  async findAndUpdateByUserId(
    userId: string,
    updateClientFinalDto: UpdateClientFinalDto,
  ) {
    const clientUpdeted = await this.clientFinal.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      updateClientFinalDto,
      { new: true },
    );

    console.log('updateClientFinalDto: ', clientUpdeted);

    if (!clientUpdeted) {
      throw new Error(MESSAGE_ERROR.CLIENT_NOT_UPDATE);
    }

    return clientUpdeted;
  }

  async deactiveRole(userId: string, session?: any) {
    const clientFinal = await this.clientFinal.findOneAndUpdate(
      { userId: userId },
      { isActiveRole: false },
      { new: true, session },
    );
    console.log('clientFinal: ', clientFinal);

    return clientFinal;
  }

  async activeRole(userId: string) {
    const clientFinal = await this.clientFinal.findOneAndUpdate(
      { userId: userId },
      { isActiveRole: true },
      { new: true },
    );
    return clientFinal;
  }

  remove(id: string) {
    return `This action removes a #${id} clientFinal`;
  }
}
