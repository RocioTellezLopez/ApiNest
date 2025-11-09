import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { rolEnum } from 'src/common/enums/rol.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateSelfUserDto {
  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsNumber()
  phoneNumber?: number;

  @IsOptional()
  @IsString()
  imgAvatar?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  nit?: string;

  @IsOptional()
  @IsString()
  realStateAddress?: string;
}

export class UpdateUserByAdminDto extends PartialType(UpdateSelfUserDto) {
  @IsOptional()
  @IsString()
  fullname?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsEnum(rolEnum)
  rol?: rolEnum;
}
