import { Module } from '@nestjs/common';
import { BcryptService } from './utils/bcrypt.service';
import { MiddlewareBuilder } from '@nestjs/core';
import { InitService } from './utils/init.service';

@Module({
  controllers: [],
  providers: [MiddlewareBuilder, BcryptService ],
  exports: [MiddlewareBuilder, BcryptService],
})
export class CommonModule {}
