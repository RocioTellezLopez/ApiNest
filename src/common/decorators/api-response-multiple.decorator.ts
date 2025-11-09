import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponseDto } from '../dto/response.dto';

export const ApiResponseMultipleDto = (
  models: Type<any>[],
  isArray = false,
  status = 200,
  examples?: Record<string, any>,
) => {
  return applyDecorators(
    ApiExtraModels(ResponseDto, ...models),
    ApiResponse({
      status,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDto) },
          {
            properties: {
              data: isArray
                ? {
                    type: 'array',
                    items: {
                      oneOf: models.map((m) => ({ $ref: getSchemaPath(m) })),
                    },
                  }
                : {
                    oneOf: models.map((m) => ({ $ref: getSchemaPath(m) })),
                  },
            },
            ...(examples ? { examples } : {}),
          },
        ],
      },
    }),
  );
};