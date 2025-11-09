import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ClientFinalModule } from './client-final/client-final.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/env.config';
import { MongooseModule } from '@nestjs/mongoose';
import { InitService } from './common/utils/init.service';
import { CommonModule } from './common/common.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ZoneModule } from './zone/zone.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      isGlobal: true,
    }),
    MongooseModule.forRoot(EnvConfiguration().mongodb, {
      dbName: EnvConfiguration().dbname,
    }),
    UserModule,
    ClientFinalModule,
    AdminModule,
    CommonModule,
    AuthModule,
    ZoneModule,
  ],
  providers: [
    AppService,
    InitService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure() {}
}
