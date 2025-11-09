import { Document, Model } from 'mongoose';

export async function findOneWithPopulate<T extends Document>(
  model: Model<T>,
  id: string,
  populateFields: string[] = [],
) {
  let query = model.findById(id);

  populateFields.forEach((field) => {
    query = query.populate(field.trim());
  });

  return query.exec();
}
