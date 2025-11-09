import { forwardRef, Module } from '@nestjs/common';
import { ClientFinalService } from './client-final.service';
import { ClientFinalController } from './client-final.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientFinal, ClientFinalSchema } from './entities/client-final.entity';
import { UserModule } from './../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ClientFinal.name,
        schema: ClientFinalSchema,
      },
    ]),
    forwardRef(() => UserModule),
  ],
  controllers: [ClientFinalController],
  providers: [ClientFinalService],
  exports: [MongooseModule, ClientFinalService],
})
export class ClientFinalModule {}
