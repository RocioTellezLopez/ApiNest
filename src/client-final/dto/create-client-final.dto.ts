import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { IsObjectId } from '../../common/decorators/is-object-id.decorator';
import { CreateUserDto } from '../../user/dto/create-user.dto';

export class CreateClientFinalDto extends CreateUserDto {
  @ApiProperty({
    example: 'BenitoJuarez o alias',
    description: 'Nombre del cliente que se mostrara en la UI',
  })
  @IsString()
  fullNameClient: string;

  @IsOptional()
  @IsArray()
  @IsObjectId()
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map((v) => new Types.ObjectId(v)) : [],
  )
  lastPropertyVisits: Types.ObjectId[];

  @IsOptional()
  @IsBoolean()
  isActiveRole: boolean;
}
