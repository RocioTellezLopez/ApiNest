import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateZoneInput } from './create-zone.input';
import { IsMongoId } from 'class-validator';

@InputType()
export class UpdateZoneInput extends PartialType(CreateZoneInput) {
  @Field(() => String)
  @IsMongoId()
  id: string;
}
