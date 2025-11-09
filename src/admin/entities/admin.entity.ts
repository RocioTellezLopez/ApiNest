import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AdminEnum } from '../../common/enums/admin-operation.enum';
import { TypeAdminEnum } from '../../common/enums/typeAdmin.enum';

@Schema({ timestamps: true })
export class Admin extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: String,
    enum: TypeAdminEnum,
    required: true,
  })
  typeAdmin: TypeAdminEnum;

  @Prop({
    type: [String],
    enum: AdminEnum,
    default: [],
  })
  operationPermise: AdminEnum[];
}
export const AdminSchema = SchemaFactory.createForClass(Admin);
