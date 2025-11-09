import { Model } from 'mongoose';
import { paginateAndPopulate } from './pagination-populate.helper';

interface AdvancedFindParams {
  baseModel: Model<any>;
  filter: Record<string, any>;
  sort?: Record<string, 1 | -1>;
  options?: any;
  populate?: string[] | string | any[];
  relationResolvers?: Record<string, any>;
  fieldMap?: Record<string, string[]>;
}

export async function advancedFind({
  baseModel,
  filter,
  sort = {},
  options = {},
  populate = [],
  relationResolvers = {},
  fieldMap = {},
}: AdvancedFindParams) {
  const queryFilter = { ...filter };

  let populateArray: any[] = [];

  if (Array.isArray(populate)) {
    populateArray = populate;
  } else if (typeof populate === 'string' && populate.trim() !== '') {
    populateArray = populate.split(',').map((p) => p.trim());
  }

  for (const [relation, fields] of Object.entries(fieldMap)) {
    for (const field of fields) {
      if (queryFilter[field] !== undefined) {
        queryFilter[`${relation}_${field}`] = queryFilter[field];
        delete queryFilter[field];
      }
    }
  }

  const relationFilters: Record<string, Record<string, any>> = {};

  for (const [key, value] of Object.entries(queryFilter)) {
    if (key.includes('_')) {
      const [relation, field] = key.split('_');
      relationFilters[relation] = relationFilters[relation] || {};
      relationFilters[relation][field] = value;
    }
  }

  for (const [relation, relatedFilter] of Object.entries(relationFilters)) {
    const service = relationResolvers[relation];
    if (!service?.findIdsByFilter) continue;

    const ids = await service.findIdsByFilter(relatedFilter);

    queryFilter[relation] = ids.length > 0 ? { $in: ids } : { $in: [] };

    for (const field of Object.keys(relatedFilter)) {
      delete queryFilter[`${relation}_${field}`];
    }
  }

  const paginationOptions = { ...options };
  if (populate && populate.length > 0) {
    paginationOptions.populate = populateArray;
  }

  const result = await paginateAndPopulate(
    baseModel,
    queryFilter,
    paginationOptions,
    sort,
  );
  let filteredData = result.data;

  if (filter.postFilters) {
    for (const [path, value] of Object.entries(filter.postFilters)) {
      filteredData = filteredData.filter((doc: any) => {
        const pathValue = path.split('.').reduce((acc, key) => acc?.[key], doc);
        return pathValue === value;
      });
    }
  }

  return {
    results: filteredData,
    meta: result.meta,
  };
}
