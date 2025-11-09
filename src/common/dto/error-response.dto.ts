import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ description: 'Código de estado HTTP' })
  statusCode: number;

  @ApiProperty({
    description: 'Mensaje de error o lista de errores',
  })
  message: string | string[];

  @ApiProperty({
    description: 'Tipo de error (Bad Request, Conflict, Not Found, etc.)',
  })
  error: string;

  @ApiProperty({
    description: 'Ruta del endpoint donde ocurrió el error',
  })
  path: string;

  @ApiProperty({
    description: 'Fecha en que ocurrió el error',
  })
  timestamp: string;
}
