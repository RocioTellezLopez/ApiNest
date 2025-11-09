import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { ZoneMapType } from '../../common/enums/zoneMap.enum';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Schema({ timestamps: true })
export class Zone{

  @Field(() => ID, {nullable: true})
  _id: string;

  @ApiProperty({
    enum: ZoneMapType,
    enumName: 'ZoneMapType',
    example: ZoneMapType.NORTE,
    description: 'Zona permitida',
  })
  @Field(() => ZoneMapType)
  @Prop({
    type: String,
    enum: ZoneMapType,
    required: true,
    unique: true,
    index: true,
  })
  zoneName: ZoneMapType;


  @Field(() => String, {nullable: true})
  @Prop({
    type: String,
    required: true,
  })
  description: string;

}

export const ZoneSchema = SchemaFactory.createForClass(Zone);
