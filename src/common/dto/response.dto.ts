import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MetaDto } from './meta.dto';

export class ResponseDto<T> {
  @ApiProperty({
    example: 'Operation executed successfully',
    description: 'Mensaje de éxito, cambia según el endpoint',
  })
  message: string;

  @ApiProperty({
    example: 200,
    description: 'Código de estado HTTP',
  })
  statusCode: number;

  @ApiProperty({
    example: true,
    description: 'Indica si la operación fue exitosa',
  })
  success: boolean;

  @ApiProperty({
    description: 'Datos de la respuesta, depende del endpoint',
  })
  data: T;

  @ApiPropertyOptional({
    type: MetaDto,
    description: 'Información de paginación (solo en listados)',
  })
  meta?: MetaDto;
}
