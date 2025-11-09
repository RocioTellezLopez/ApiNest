import { Types } from 'mongoose';
import { IsObjectId } from '../decorators/is-object-id.decorator';
import { IsDataURI, IsDate, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AcceptTermsDto {
  @ApiProperty({
    example: 'mongo-id-term-0001',
    description: 'ID del término que fue aceptado por el usuario',
  })
  @IsNotEmpty()
  @IsObjectId()
  termId: string;

  @IsOptional()
  @IsDate()
  acceptedAt?: string;
}
