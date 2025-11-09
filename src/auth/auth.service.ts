import { LoginDto } from './dto/login.dto';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as fs from 'fs';
import * as path from 'path';
import { UserService } from './../user/user.service';
import { ClientFinalService } from './../client-final/client-final.service';
import { AdminService } from './../admin/admin.service';
import { rolEnum } from './../common/enums/rol.enum';
import { TypeAdminEnum } from './../common/enums/typeAdmin.enum';
import { BcryptService } from './../common/utils/bcrypt.service';
import { CreateClientFinalDto } from 'src/client-final/dto/create-client-final.dto';

const MESSAGE_ERROR = {
  USER_NOT_FOUND: 'User not found',
  INVALID_CREDENTIALS: 'Invalid credentials',
  INVALID_ROLE: 'Invalid role or not provided',
};

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
    private readonly bcryptService: BcryptService,
    private readonly userService: UserService,
    private readonly adminService: AdminService,
    private readonly clientFinalService: ClientFinalService,
  ) {}

  async register(clientDto: CreateClientFinalDto) {
    if (clientDto.rol !== rolEnum.CLIENTFINAL) {
      throw new ConflictException(MESSAGE_ERROR.INVALID_ROLE);
    }

    const newUser = await this.clientFinalService.create(clientDto);

    return newUser;
  }

  async registerAdmin(dto: any) {
    let resultAdmin: any;

    switch (dto.typeAdmin) {
      case TypeAdminEnum.MAIN:
        resultAdmin = await this.adminService.createMainAdmin(dto);
        break;
      case TypeAdminEnum.AGENTS:
        resultAdmin = await this.adminService.createAgents(dto);
        break;
      default:
        throw new ConflictException(MESSAGE_ERROR.INVALID_ROLE);
    }

    return resultAdmin;
  }

  async validateUser(loginDto: LoginDto) {
    const user: any = await this.userService.findByEmail(loginDto.email);

    if (!user) throw new UnauthorizedException(MESSAGE_ERROR.USER_NOT_FOUND);

    const passwordValid = await this.bcryptService.comparePassword(
      loginDto.password,
      user.password,
    );

    if (!passwordValid)
      throw new UnauthorizedException(MESSAGE_ERROR.INVALID_CREDENTIALS);

    const { password, ...result } = user.toObject();
    return result;
  }

  async generateToken(user: any) {
    const payload = {
      sub: user._id,
      email: user.email,
      rol: user.rol,
    };
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET || 'admin-key',
      expiresIn: '1d',
    });

    return token;
  }

  async getProfile(userId: string, rol: string) {
    if (rol === rolEnum.ADMIN) {
      return await this.adminService.getProfileAdminByUserId(userId);
    } else if (rol === rolEnum.CLIENTFINAL) {
      return await this.clientFinalService.getProfileByUserId(userId);
    }

    return null;
  }

  async getProfileWithUser(userId: string, rol: string) {
    const user = await this.userService.getPerfileUser(userId);
    const perfil = await this.getProfile(userId, rol);

    return { user: user, perfil: perfil };
  }

  
}
