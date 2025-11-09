import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AdminEnum } from '../../common/enums/admin-operation.enum';
import { TypeAdminEnum } from '../../common/enums/typeAdmin.enum';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

export class CreateAdminDto extends CreateUserDto {
  @ApiProperty({
    enum: TypeAdminEnum,
    description: 'Seleccione el tipo de Admin (Main o Agent)',
  })
  @IsEnum(TypeAdminEnum)
  @IsNotEmpty()
  typeAdmin: TypeAdminEnum;

  @ApiProperty({
    example: [AdminEnum.CREATEUSER, AdminEnum.READUSER],
    description: 'Permisos asignados',
    enum: AdminEnum,
    isArray: true,
  })
  @IsEnum(AdminEnum, { each: true })
  @IsNotEmpty()
  operationPermise: AdminEnum[];
}
