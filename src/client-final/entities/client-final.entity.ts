import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class ClientFinal extends Document {
  @ApiPropertyOptional({
    example: 'mongo-id-user-0001',
    description: 'ID del usuario (MongoID)',
  })
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  })
  userId: Types.ObjectId;

  @ApiProperty({
    example: 'BenitoJuarez o alias',
    description: 'Nombre del cliente que se mostrara en la UI',
  })
  @Prop({ type: String, required: true })
  fullNameClient: string;

  @ApiPropertyOptional({
    example: ['mongo-id-property-0001', 'mongo-id-property-0002'],
    description: 'Array de IDs de las últimas propiedades visitadas (MongoID)',
  })
  @Prop({
    type: [Types.ObjectId],
    default: [],
  })
  lastPropertyVisits?: Types.ObjectId[]; // property o noticeProperty

  @ApiPropertyOptional({
    example: true,
    description: 'Indica si el rol actual está activo',
  })
  @Prop({ type: Boolean, default: true })
  isActiveRole?: boolean;
}
export const ClientFinalSchema = SchemaFactory.createForClass(ClientFinal);
