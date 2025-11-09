import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryFilterDto {
  @ApiPropertyOptional({
    description:
      'Filtros dinámicos por campos (ej: typeOperationId, zoneId, etc.)',
    example: {
      typeOperationId: '68ef0098c570bdf566e4bb7c',
      zoneId: '68eeffc9c570bdf566e4bb73',
    },
  })
  @IsOptional()
  filter?: Record<string, any>;

  @ApiPropertyOptional({
    description:
      'Ordenamiento de resultados. Ejemplo: "price_asc" o "publicationDate_desc"',
    example: 'price_asc',
  })
  @IsOptional()
  @IsString()
  sort?: string;
}
