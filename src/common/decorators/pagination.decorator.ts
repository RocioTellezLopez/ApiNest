import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PaginationQueryDto } from '../dto/pagination-query.dto';

export const Pagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): PaginationQueryDto => {
    const request = ctx.switchToHttp().getRequest();
    const { page = 1, limit = 10, populate } = request.query;

    return {
      page: Number(page),
      limit: Number(limit),
      populate: populate as string,
    };
  },
);
