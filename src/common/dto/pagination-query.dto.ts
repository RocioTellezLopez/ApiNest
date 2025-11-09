import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Número de página' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page: number = 1;

  @ApiPropertyOptional({ description: 'Resultados por página' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit: number = 10;

  @ApiPropertyOptional({
    example: 'userId,propertyId',
    description: 'Campos a popular (separados por coma)',
  })
  @IsOptional()
  @IsString()
  populate?: string;
}
