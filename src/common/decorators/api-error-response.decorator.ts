import { applyDecorators } from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ErrorResponseDto } from '../dto/error-response.dto';
import { HttpStatus } from '@nestjs/common';

type ErrorConfig = {
  [status: number]: {
    description: string;
    message: string;
    path?: string; // opcional
  };
};

// Helper: obtener nombre de error desde HttpStatus
function getErrorName(status: number): string {
  return HttpStatus[status] || 'Error';
}

export function ApiErrorResponses(config: ErrorConfig) {
  return applyDecorators(
    ...Object.entries(config).map(
      ([status, { description, message, path }]) => {
        const code = +status;

        return ApiResponse({
          status: code,
          description,
          schema: {
            allOf: [
              { $ref: getSchemaPath(ErrorResponseDto) },
              {
                example: {
                  statusCode: code,
                  message,
                  error: getErrorName(code),
                  path: path ?? '/api/v1/resource', // dinámico si se pasa, genérico si no
                  timestamp: new Date().toISOString(),
                },
              },
            ],
          },
        });
      },
    ),
  );
}
