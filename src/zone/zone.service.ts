import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { Zone } from './entities/zone.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


const MESSAGE_ERROR = {
  ZONE_EXISTS: 'the zone already exists',
  ZONE_NOT_FOUND: 'the zone not found',
};

@Injectable()
export class ZoneService {
  constructor(
    @InjectModel(Zone.name) private readonly zoneModel: Model<Zone>,
  ) {}
  async create(createZoneDto: CreateZoneDto) {
    const existsZone = await this.zoneModel.exists({
      zone: createZoneDto.zoneName,
    });

    if (existsZone) {
      throw new BadRequestException(MESSAGE_ERROR.ZONE_EXISTS);
    }

    const zone = await new this.zoneModel(createZoneDto).save();
    return zone;
  }

  async findAll() {
    const zones = await this.zoneModel.find().lean().exec();

    if (!zones) {
      throw new BadRequestException(MESSAGE_ERROR.ZONE_NOT_FOUND);
    }
    return zones;
  }

  async findOneById(id: string) {
    const zone = await this.zoneModel.findById(id).lean().exec();

    if (!zone) {
      throw new BadRequestException(MESSAGE_ERROR.ZONE_NOT_FOUND);
    }

    return zone;
  }

  async update(id: string, updateZoneDto: UpdateZoneDto) {

    
    const zone = await this.zoneModel
      .findByIdAndUpdate(id, updateZoneDto, { new: true })
      .exec();

    if (!zone) {
      throw new BadRequestException(MESSAGE_ERROR.ZONE_NOT_FOUND);
    }

    return zone;
  }

  async remove(id: string) {
    const deletedZone = await this.zoneModel.findByIdAndDelete(id);

    if (!deletedZone) {
      throw new BadRequestException(MESSAGE_ERROR.ZONE_NOT_FOUND);
    }
    return deletedZone;
  }
}
