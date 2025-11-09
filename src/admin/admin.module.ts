import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UserModule } from './../user/user.module';
import { CommonModule } from './../common/common.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './entities/admin.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    UserModule,
    CommonModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [MongooseModule, AdminService],
})
export class AdminModule {}
