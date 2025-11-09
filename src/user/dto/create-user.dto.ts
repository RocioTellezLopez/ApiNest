import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Length,
  IsNumber,
  IsUrl,
  IsString,
  ValidateNested,
} from 'class-validator';
import { rolEnum } from '../../common/enums/rol.enum';
import { stateUserEnum } from '../../common/enums/stateUser.enum';
import { AcceptTermsDto } from 'src/common/dto/Accept-terms.dto';
import { Transform, Type } from 'class-transformer';
import { IsObjectId } from 'src/common/decorators/is-object-id.decorator';
import { Types } from 'mongoose';

export class CreateUserDto {
  @ApiProperty({
    example: 'Benito Juarez',
    description: 'Nombre completo del usuario',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    example: 'user-prueba@inmobiliaria.com',
    description: 'Correo electrónico del usuario',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '*********@123',
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
  })
  @IsNotEmpty()
  @Length(6, 20)
  password: string;

  @ApiProperty({
    example: 71234567,
    description: 'Número de teléfono celular del usuario',
  })
  @IsNotEmpty()
  @IsNumber()
  phoneNumber: number;

  @ApiProperty({
    enum: rolEnum,
    example: 'clientFinal || admin',
    description: 'Rol asignado al usuario por default (ClientFinal)',
  })
  @IsOptional()
  @IsEnum(rolEnum)
  rol: rolEnum;

  @ApiPropertyOptional({
    example: 'https://miweb.com/avatar.jpg',
    description: 'URL del avatar del usuario',
  })
  @IsOptional()
  @IsUrl()
  imgAvatar?: string;

  @ApiPropertyOptional({
    example: stateUserEnum.ACTIVE,
    description: 'Estado del usuario',
  })
  @IsOptional()
  @IsEnum(stateUserEnum)
  stateUser?: stateUserEnum;

  @ApiPropertyOptional({
    example: '2023-05-01T10:00:00Z',
    description: 'Fecha de eliminación del usuario',
  })
  @IsOptional()
  @IsDate()
  deleteAt?: Date;

  @ApiPropertyOptional({
    example: false,
    description: 'Indica si el usuario está bloqueado',
  })
  @IsOptional()
  @IsBoolean()
  isBlocked?: boolean;

  @ApiPropertyOptional({
    example: ['Razón 1', 'Razón 2'],
    description: 'Array de razones por las cuales el usuario fue bloqueado',
  })
  @IsOptional()
  @IsArray()
  @Length(1, 50, { each: true })
  reasonBlocked?: string[];

  @ApiPropertyOptional({
    example: '2023-05-01T10:00:00Z',
    description: 'Última fecha de inicio de sesión del usuario',
  })
  @IsOptional()
  @IsDate()
  lastLoginIn?: Date;

  @ApiProperty({
    type: () => [AcceptTermsDto],
    description: 'Historial de términos aceptados por el usuario',
  })
  @ValidateNested({ each: true })
  @Type(() => AcceptTermsDto)
  acceptTerms: AcceptTermsDto[];

  @ApiPropertyOptional({
    example: ['Notificación 1', 'Notificación 2'],
    description: 'Array de notificaciones del usuario',
  })
  @IsOptional()
  @IsArray()
  notification?: string[];

  @ApiPropertyOptional({
    example: ['mongo-id-notice-property-0001', 'mongo-id-notice-property-0002'],
    description: 'Array de IDs de propiedades favoritas (MongoID)',
  })
  @IsOptional()
  @IsArray()
  @IsObjectId()
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map((v) => new Types.ObjectId(v)) : [],
  )
  favorites?: Types.ObjectId[];

  @ApiPropertyOptional({
    example: true,
    description: 'Indica si el usuario ha sido verificado',
  })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @ApiPropertyOptional({
    example: 'mongo-id-history-role-change-0001',
    description: 'ID del historial de cambios de rol (si aplica)',
  })
  @IsOptional()
  @IsObjectId()
  @Transform(({ value }) => new Types.ObjectId(value))
  historyRoleChangeId?: string;

  @ApiPropertyOptional({
    type: Types.ObjectId,
    description: 'ID del cliente Stripe (si aplica)',
  })
  @IsOptional()
  @IsObjectId()
  @Transform(({ value }) => new Types.ObjectId(value))
  customerId?: string;
}
