import { Model } from 'mongoose';

export function deepPopulate(
  model: Model<any>,
  depth = 1,
  fieldsByPath: Record<string, string> = {},
): any[] {
  if (!model?.schema) return [];

  const refs = Object.entries(model.schema.paths)
    .filter(([_, val]: any) => val?.options?.ref)
    .map(([key, val]: any) => {
      const refModel = model.db.models[val.options.ref];
      const select = fieldsByPath[key];

      return depth > 1 && refModel
        ? {
            path: key,
            select,
            populate: deepPopulate(refModel, depth - 1, fieldsByPath),
          }
        : { path: key, select };
    });

  return refs;
}
