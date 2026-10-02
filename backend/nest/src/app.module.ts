import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { RegistrationModule } from './registration/registration.module';
import { UsersModule } from './users/users.module';
import { CmsModule } from './cms/cms.module';
import { validateEnv } from './config/env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: '../../.env',
      validate: validateEnv,
    }),
    RedisModule,
    AuthModule,
    RegistrationModule,
    UsersModule,
    CmsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

