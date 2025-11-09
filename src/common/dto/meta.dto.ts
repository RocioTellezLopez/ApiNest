import { ApiProperty } from '@nestjs/swagger';

export class MetaDto {
  @ApiProperty({ example: 100, description: 'Total de registros encontrados' })
  total: number;

  @ApiProperty({ example: 1, description: 'Número de página actual' })
  page: number;

  @ApiProperty({ example: 10, description: 'Cantidad de registros por página' })
  limit: number;

  @ApiProperty({ example: 10, description: 'Total de páginas calculadas' })
  totalPages: number;
}
