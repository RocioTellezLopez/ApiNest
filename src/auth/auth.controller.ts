import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SuccessMessage } from './../common/decorators/success-message.decorator';
import { ApiResponseDto } from './../common/decorators/api-response.decorator';
import { ApiErrorResponses } from './../common/decorators/api-error-response.decorator';
import { CreateClientFinalDto } from './../client-final/dto/create-client-final.dto';
import { CreateAdminDto } from 'src/admin/dto/create-admin.dto';
import { AuthResponseDto, LoginResponseDto } from './dto/login-response.dto';
import { UserRole } from 'src/common/decorators/user-rol.decorator';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { AuthGuard } from '@nestjs/passport';
import { EnvConfiguration } from 'src/config/env.config';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ClientFinal } from 'src/client-final/entities/client-final.entity';
import type { Response } from 'express';

const MESSAGE_SUCCESS = {
  LOGIN_SUCCESS: 'Login successful',
  REGISTER_SUCCESS: 'User registered successfull',
  REGISTER_ADMIN_SUCCESS: 'Admin registered successfully',
  LOGOUT_SUCCESS: 'Logout successful',
  PROFILE_SUCCESS: 'Profile found successfully',
  TOKEN_REFRESH_SUCCESS: 'Token refreshed successfully',
};
@ApiTags('Auth / Registro y Login')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @SuccessMessage(MESSAGE_SUCCESS.REGISTER_SUCCESS)
  @ApiOperation({
    summary: 'Registro de usuario clientFinal',
  })
  @ApiResponseDto(AuthResponseDto, false, 201)
  @ApiErrorResponses({
    400: {
      description: 'User validation DTO',
      message: 'Error user validation DTO',
    },
    409: {
      description: 'User conflict',
      message: 'User conflict',
    },
    500: {
      description: 'Internal server error',
      message: 'Internal server error',
    },
  })
  async register(@Body() dto: CreateClientFinalDto) {
    return this.authService.register(dto);
  }

  @Post('register-admin')
  @SuccessMessage(MESSAGE_SUCCESS.REGISTER_ADMIN_SUCCESS)
  @ApiOperation({ summary: 'Registro de administradores main y agents' })
  @ApiResponseDto(CreateAdminDto, false, 201)
  @ApiErrorResponses({
    400: {
      description: 'Bad Request - Validation or business logic errors',
      message:
        'This may fail due to: maximum admin limit reached, user creation failed, or invalid DTO data',
    },
    409: {
      description: 'Conflict - Duplicate or existing admin',
      message:
        'This may fail due to: admin already exists or duplicated email conflict',
    },
    500: {
      description: 'Internal server error',
      message: 'Internal server error',
    },
  })
  async registerAdmin(@Body() dto: CreateAdminDto) {
    return this.authService.registerAdmin(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @SuccessMessage(MESSAGE_SUCCESS.LOGIN_SUCCESS)
  @ApiOperation({ summary: 'Login de usuarios' })
  @ApiResponseDto(LoginResponseDto, false, 200)
  @ApiErrorResponses({
    400: {
      description: 'User validation DTO',
      message: 'Error user validation DTO',
    },
    401: {
      description: 'Unauthorized (invalid credentials)',
      message: 'Invalid credentials',
    },
    404: {
      description: 'User not found',
      message: 'User not found',
    },
    500: {
      description: 'Internal server error',
      message: 'Internal server error',
    },
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(loginDto);
    const token = await this.authService.generateToken(user);

    res.cookie('access-token', token, {
      httpOnly: true,
      secure: EnvConfiguration().environment === 'production',
      sameSite: 'strict',
    });

    const perfil = await this.authService.getProfile(user._id, user.rol);

    return {
      access_token: token,
      user: user,
      perfil: perfil,
    };
  }

  @Get('profile')
  @SuccessMessage(MESSAGE_SUCCESS.PROFILE_SUCCESS)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Obtener perfil de usuario' })
  @ApiResponseDto(ClientFinal, false, 200)
  @ApiErrorResponses({
    401: {
      description: 'Unauthorized (invalid credentials)',
      message: 'Invalid credentials',
    },
    404: {
      description: 'User not found',
      message: 'User not found',
    },
    500: {
      description: 'Internal server error',
      message: 'Internal server error',
    },
  })
  async getProfile(@UserId() userId: string, @UserRole() rol: string) {
    return await this.authService.getProfileWithUser(userId, rol);
  }

  @Post('refresh-token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @SuccessMessage(MESSAGE_SUCCESS.TOKEN_REFRESH_SUCCESS)
  @ApiOperation({ summary: 'Actualizar token de acceso' })
  async refreshToken(@Req() Req, @Res({ passthrough: true }) res: Response) {
    const user = Req.user;

    const token = await this.authService.generateToken(user);

    res.cookie('access-token', token, {
      httpOnly: true,
      secure: EnvConfiguration().environment === 'production',
      sameSite: 'strict',
    });

    return {
      refreshed: true,
      access_token: token,
    };
  }
}
