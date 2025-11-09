import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ZoneService } from './zone.service';
import { Zone } from './entities/zone.entity';
import { CreateZoneInput } from './dto/create-zone.input';
import { UpdateZoneInput } from './dto/update-zone.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';

@Resolver(() => Zone)
export class ZoneResolver {
  constructor(private readonly zoneService: ZoneService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Zone)
  async createZone(@Args('createZoneInput') createZoneInput: CreateZoneInput) {
    return await this.zoneService.create(createZoneInput);
  }

  @Query(() => [Zone], { name: 'zones' })
  async findAll() {
    const zones = await this.zoneService.findAll();
    return zones;
  }

  @Query(() => Zone, { name: 'zone' })
  async findOne(@Args('id', { type: () => String }) id: string) {
    return await this.zoneService.findOneById(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Zone)
  async updateZone(@Args('updateZoneInput') updateZoneInput: UpdateZoneInput) {
    const {id, ...data} = updateZoneInput
    return await this.zoneService.update(id, data);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Zone)
  async removeZone(@Args('id', { type: () => String }) id: string) {
    return await this.zoneService.remove(id);
  }
}
