import { Module } from '@nestjs/common';
import { ZoneService } from './zone.service';
import { ZoneController } from './zone.controller';
import { Zone, ZoneSchema } from './entities/zone.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ZoneResolver } from './zone.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Zone.name, schema: ZoneSchema },
    ]),
  ],
  controllers: [ZoneController],
  providers: [ZoneService, ZoneResolver],
  exports: [ZoneService],
})
export class ZoneModule {}
