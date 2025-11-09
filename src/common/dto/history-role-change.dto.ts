import { Types } from "mongoose";
import { rolEnum } from "../enums/rol.enum";
import { IsObjectId } from "../decorators/is-object-id.decorator";
import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEnum } from "class-validator";

export class HistoryRoleChangeDto {

    @ApiProperty({
        example: rolEnum.CLIENTINMOBILIARIA,
        description: 'Nuevo rol del usuario',
    })
    @IsEnum(rolEnum)
    previousRole: rolEnum;

    @ApiProperty({
        example: 'mongo-id-role-0001',
        description: 'ID del rol anterior (MongoID)',
    })
    @IsObjectId()
    previousRoleId: Types.ObjectId;

    @ApiProperty({
        example: '',
        description: 'Fecha y hora en la que se realizó el cambio de rol',
    })
    @IsDate()
    modifiedAt: Date;
}
