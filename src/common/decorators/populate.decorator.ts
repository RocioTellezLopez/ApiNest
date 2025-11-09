import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Populate = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string[] => {
    const request = ctx.switchToHttp().getRequest();
    const { populate } = request.query;

    if (!populate) return [];
    return (populate as string).split(',').map((f) => f.trim());
  },
);
