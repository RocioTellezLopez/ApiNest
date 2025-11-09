import { applyDecorators, Type } from '@nestjs/common';
import { ApiBody, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';

export const ApiBodyMultipleDto = (models: Type<any>[]) => {
  return applyDecorators(
    ApiExtraModels(...models),
    ApiBody({
      schema:
        models.length === 1
          ? { $ref: getSchemaPath(models[0]) } // 👈 Si solo hay uno, no usamos oneOf
          : {
              oneOf: models.map((m) => ({
                $ref: getSchemaPath(m),
              })),
            },
    }),
  );
};