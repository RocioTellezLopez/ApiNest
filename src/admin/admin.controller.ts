import {
  Controller,
  Get,
  Param,
  Delete,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { ApiResponseDto } from 'src/common/decorators/api-response.decorator';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ApiErrorResponses } from 'src/common/decorators/api-error-response.decorator';

const MESSAGE_SUCCESS = {
  ADMIN_FOUND: 'Admin found successfully',
  ADMIN_DELETED: 'Admin deleted successfully',
};

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los admins' })
  @SuccessMessage(MESSAGE_SUCCESS.ADMIN_FOUND)
  @ApiResponseDto(CreateAdminDto, true, 200)
  @ApiErrorResponses({
    400: { description: 'Bad Request', message: 'Bad Request' },
    404: { description: 'Admin not found', message: 'the admin not found' },
    500: {
      description: 'Internal server error',
      message: 'Internal server error',
    },
  })
  async getAdmins() {
    return this.adminService.getAdmins();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un admin por ID' })
  @SuccessMessage(MESSAGE_SUCCESS.ADMIN_FOUND)
  @ApiResponseDto(CreateAdminDto, false, 200)
  @ApiErrorResponses({
    400: { description: 'Bad Request', message: 'Bad Request' },
    404: { description: 'Admin not found', message: 'the admin not found' },
    500: {
      description: 'Internal server error',
      message: 'Internal server error',
    },
  })
  async getAdminById(@Param('id') id: string) {
    return this.adminService.getAdminById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un admin agents por ID' })
  @ApiBearerAuth("access-token")
  @SuccessMessage(MESSAGE_SUCCESS.ADMIN_DELETED)
  @ApiResponseDto(CreateAdminDto, false, 200)
  @ApiErrorResponses({
    400: { description: 'Bad Request', message: 'Bad Request' },
    404: { description: 'Admin not found', message: 'the admin not found' },
    500: {
      description: 'Internal server error',
      message: 'Internal server error',
    },
  })
  async deleteAdminAgents(@Param('id') id: string, @Req() req: any) {
    return this.adminService.deleteAdminAgents(id, req.user.role);
  }
}
