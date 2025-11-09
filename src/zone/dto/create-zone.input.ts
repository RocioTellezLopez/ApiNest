import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ZoneMapType } from '../../common/enums/zoneMap.enum';

registerEnumType(ZoneMapType, {
  name: 'ZoneMapType',
  description: 'Zona permitida',
});

@InputType()
export class CreateZoneInput {
  @Field(() => ZoneMapType)
  @IsNotEmpty()
  @IsEnum(ZoneMapType)
  zoneName: ZoneMapType;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  description: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  zoneCode: string;
}
