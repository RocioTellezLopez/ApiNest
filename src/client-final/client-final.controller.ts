import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClientFinalService } from './client-final.service';
import { UpdateClientFinalDto } from './dto/update-client-final.dto';

@Controller('client-final')
export class ClientFinalController {
  constructor(private readonly clientFinalService: ClientFinalService) {}


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientFinalDto: UpdateClientFinalDto) {
    return this.clientFinalService.update(id, updateClientFinalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientFinalService.remove(id);
  }
}
