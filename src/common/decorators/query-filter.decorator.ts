import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';

/**
 * Extrae filtros y ordenamiento de la query del request.
 * Compatible con helpers paginateAndPopulate y advancedFind.
 *
 * Ejemplo:
 *  /notice-property?available=true&price=1000-5000&sort=price_desc
 *
 * Devuelve:
 *  {
 *    filter: { available: true, price: { $gte: 1000, $lte: 5000 } },
 *    sort: { price: -1 }
 *  }
 */
export const QueryFilter = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    const filter: Record<string, any> = {};
    const sort: Record<string, 1 | -1> = {};

    try {
      for (const [key, rawValue] of Object.entries(query)) {
        if (
          key === 'sort' ||
          key === 'page' ||
          key === 'limit' ||
          key === 'populate'
        )
          continue;

        let value = rawValue;

        if (value === 'true') value = true;
        else if (value === 'false') value = false;

        if (key === 'priceMax') {
          const max = Number(value);
          if (!isNaN(max)) {
            filter['price'] = { $gte: 0, $lte: max };
            continue;
          } else {
            throw new BadRequestException('Invalid priceMax value');
          }
        }

        if (typeof value === 'string' && value.includes('-')) {
          const [min, max] = value.split('-').map((v) => Number(v.trim()));
          if (!isNaN(min) && !isNaN(max)) {
            filter[key] = { $gte: min, $lte: max };
            continue;
          }
        }

        filter[key] = value;
      }

      if (query.sort) {
        const sortValue = query.sort.toString();
        const [field, direction] = sortValue.split('_');
        sort[field] = direction === 'desc' ? -1 : 1;
      } else {
        sort['createdAt'] = -1;
      }

      return { filter, sort };
    } catch (err) {
      throw new BadRequestException('Invalid query parameters');
    }
  },
);
