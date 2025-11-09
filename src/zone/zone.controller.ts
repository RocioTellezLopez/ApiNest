import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ZoneService } from './zone.service';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Zone } from './entities/zone.entity';
import { ZoneMapType } from '../common/enums/zoneMap.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Zone')
@Controller('zone')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class ZoneController {
  constructor(private readonly zoneService: ZoneService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una zona' })
  @ApiBody({
    type: CreateZoneDto,
    examples: {
      norte: { value: { zoneName: ZoneMapType.NORTE } },
      sur: { value: { zoneName: ZoneMapType.SUR } },
    },
  })
  @ApiCreatedResponse({
    description: 'Zona creada exitosamente',
    type: Zone,
  })
  @ApiBadRequestResponse({
    description:
      'Datos inválidos o la zona ya existe. Mensajes posibles: "the zone already exists" o errores de validación del enum.',
    schema: {
      example: {
        statusCode: 400,
        message: 'the zone already exists',
        error: 'Bad Request',
      },
    },
  })
  async create(@Body() createZoneDto: CreateZoneDto) {
    return this.zoneService.create(createZoneDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar zonas' })
  @ApiOkResponse({
    description: 'Listado',
    schema: {
      example: {
        message: 'Request successful',
        data: [
          {
            _id: '66c0a11f3d7b0f1a9c3b1234',
            zoneName: 'norte',
            createdAt: '2025-08-06T03:18:07.541Z',
            updatedAt: '2025-08-06T03:18:07.541Z',
            __v: 0,
          },
        ],
        statusCode: 200,
        success: true,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'No se encontraron zonas',
    schema: {
      example: {
        statusCode: 400,
        message: 'the zone not found',
        error: 'Bad Request',
      },
    },
  })
  async findAll() {
    return this.zoneService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una zona por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID de MongoDB',
    example: '66b9a01f3d7b0f1a9c3b1234',
  })
  @ApiOkResponse({ description: 'Encontrado', type: Zone })
  @ApiBadRequestResponse({
    description: 'No encontrado',
    schema: {
      example: {
        statusCode: 400,
        message: 'the zone not found',
        error: 'Bad Request',
      },
    },
  })
  async findOne(@Param('id') id: string) {
    return this.zoneService.findOneById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una zona' })
  @ApiParam({
    name: 'id',
    description: 'ID de MongoDB',
    example: '66b9a01f3d7b0f1a9c3b1234',
  })
  @ApiBody({
    type: UpdateZoneDto,
    examples: {
      cambioNombre: { value: { zoneName: ZoneMapType.NORTE } },
    },
  })
  @ApiOkResponse({ description: 'Actualizado', type: Zone })
  @ApiBadRequestResponse({
    description:
      'Datos inválidos o la zona no existe. Mensajes posibles: "the zone not found" o errores de validación del enum.',
    schema: {
      example: {
        statusCode: 400,
        message: 'the zone not found',
        error: 'Bad Request',
      },
    },
  })
  async update(@Param('id') id: string, @Body() updateZoneDto: UpdateZoneDto) {
    return this.zoneService.update(id, updateZoneDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una zona' })
  @ApiParam({
    name: 'id',
    description: 'ID de MongoDB',
    example: '66b9a01f3d7b0f1a9c3b1234',
  })
  @ApiOkResponse({ description: 'Eliminado', type: Zone })
  @ApiBadRequestResponse({
    description: 'No encontrado',
    schema: {
      example: {
        statusCode: 400,
        message: 'the zone not found',
        error: 'Bad Request',
      },
    },
  })
  async remove(@Param('id') id: string) {
    return this.zoneService.remove(id);
  }
}
