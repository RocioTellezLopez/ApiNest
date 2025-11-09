import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ZoneMapType } from '../../common/enums/zoneMap.enum';
export class CreateZoneDto {
  @ApiProperty({
    enum: ZoneMapType,
    enumName: 'ZoneMapType',
    example: ZoneMapType.NORTE,
    description: 'Zona permitida',
  })
  @IsNotEmpty()
  @IsEnum(ZoneMapType)
  zoneName: ZoneMapType;
}
