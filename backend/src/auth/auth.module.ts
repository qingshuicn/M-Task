import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { DatabaseModule } from '../database/database.module';
import { RedisModule } from '../redis/redis.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { OAuthPkceStrategy } from './strategies/oauth-pkce.strategy';
import { RolesGuard } from './guards/roles.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { AuthModuleOptions } from './interfaces/auth-module-options.interface';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const options = config.getOrThrow<AuthModuleOptions>('auth');
        return {
          privateKey: options.jwt.privateKey,
          publicKey: options.jwt.publicKey,
          signOptions: {
            algorithm: 'RS256',
            issuer: options.jwt.issuer,
            audience: options.jwt.audience,
            expiresIn: options.jwt.accessTokenTtl,
          },
        };
      },
    }),
    DatabaseModule,
    RedisModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    OAuthPkceStrategy,
    RolesGuard,
    PermissionsGuard,
  ],
  exports: [AuthService, RolesGuard, PermissionsGuard],
})
export class AuthModule {}
