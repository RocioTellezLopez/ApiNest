import { PartialType } from '@nestjs/mapped-types';
import { CreateClientFinalDto } from './create-client-final.dto';

export class UpdateClientFinalDto extends PartialType(CreateClientFinalDto) {}
