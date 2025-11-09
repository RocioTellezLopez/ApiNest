import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { ZoneMapType } from '../../common/enums/zoneMap.enum';

@Schema({ timestamps: true })
export class Zone extends Document {
  @ApiProperty({
    enum: ZoneMapType,
    enumName: 'ZoneMapType',
    example: ZoneMapType.NORTE,
    description: 'Zona permitida',
  })
  @Prop({
    type: String,
    enum: ZoneMapType,
    required: true,
    unique: true,
    index: true,
  })
  zoneName: ZoneMapType;
}

export const ZoneSchema = SchemaFactory.createForClass(Zone);
