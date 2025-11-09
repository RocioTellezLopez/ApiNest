import {
  Controller,

  Post,
  Body,

  UseGuards,
  Get,

} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

import {
  ApiBearerAuth,
  ApiOperation,

  ApiTags,

} from '@nestjs/swagger';

import { UserId } from 'src/common/decorators/user-id.decorator';
import { UserRole } from 'src/common/decorators/user-rol.decorator';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { ApiResponseDto } from 'src/common/decorators/api-response.decorator';
import { ApiErrorResponses } from 'src/common/decorators/api-error-response.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

const MESSAGE_ERROR = {
  UNAUTHORIZED_CLIENT_OR_ADMIN: 'Unauthorized client or admin',
  USER_NOT_FOUND: 'User not found',
  INTERNAL_SERVER_ERROR: 'Internal server error',
};

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


 
  @Get('profile')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @SuccessMessage('User found successfully')
  async getProfile(@UserId() userId: string, @UserRole() rol: string) {
    return await this.userService.getPerfileUser(userId);
  }
}
