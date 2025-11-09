import { Model, Document } from 'mongoose';
import { PaginationQueryDto } from '../dto/pagination-query.dto';

interface PaginationResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
}

export async function paginateAndPopulate<T extends Document>(
  model: Model<T>,
  filter: Record<string, any> = {},
  options: PaginationQueryDto & { populate?: string[] | string | any[] },
  sort: Record<string, 1 | -1> = {},
): Promise<PaginationResult<T>> {
  const { page, limit, populate } = options;

  const populateFields =
    typeof populate === 'string'
      ? populate.split(',').map((p) => p.trim())
      : Array.isArray(populate)
        ? populate
        : [];

  const applyPopulate = (query: any, populateItem: any) => {
    if (!populateItem) return query;
    if (typeof populateItem === 'string') return query.populate(populateItem);
    if (typeof populateItem === 'object') return query.populate(populateItem);
    return query;
  };

  if (!page && !limit) {
    let query = model.find(filter).sort(sort);
    populateFields.forEach((field) => {
      query = applyPopulate(query, field);
    });
    const data = await query.exec();
    return { data, meta: null };
  }

  const skip = (page - 1) * limit;
  let query = model.find(filter).sort(sort).skip(skip).limit(limit);

  populateFields.forEach((field) => {
    query = applyPopulate(query, field);
  });

  const [data, total] = await Promise.all([
    query.exec(),
    model.countDocuments(filter),
  ]);

  if (!populate || (Array.isArray(populate) && populate.length === 0)) {
    const [data, total] = await Promise.all([
      model.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      model.countDocuments(filter),
    ]);
    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
