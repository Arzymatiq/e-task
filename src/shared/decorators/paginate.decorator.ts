import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface PaginateOptions {
  page: number;
  perPage: number;
}

export const Paginate = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): PaginateOptions => {
    const request = ctx.switchToHttp().getRequest();
    const { page = 1, perPage = 10 } = request.query;

    return {
      page: parseInt(page, 10),
      perPage: parseInt(perPage, 10),
    };
  },
);
