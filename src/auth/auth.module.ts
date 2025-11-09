import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '../user/user.module';
import { AdminModule } from '../admin/admin.module';
import { ClientFinalModule } from './../client-final/client-final.module';
import { CommonModule } from './../common/common.module';

@Module({
  imports: [
    PassportModule,
    CommonModule,
    UserModule,
    AdminModule,
    ClientFinalModule,
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'admin-key',
      signOptions: {
        algorithm: 'HS256',
        expiresIn: '1h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule { }
