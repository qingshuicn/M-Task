import { Injectable, NotImplementedException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

import { RedisService } from '../redis/redis.service';
import { UserRepository } from '../database/repositories/user.repository';

import { AUTH_CACHE_NAMESPACE } from './auth.constants';
import { LoginRequestDto } from './dto/login-request.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import { AuthenticatedUser, mapUserEntityToAuthUser } from './interfaces/auth-user.interface';
import { AuthModuleOptions } from './interfaces/auth-module-options.interface';

@Injectable()
export class AuthService {
  private readonly options: AuthModuleOptions;

  constructor(
    configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly userRepository: UserRepository,
  ) {
    this.options = configService.getOrThrow<AuthModuleOptions>('auth');
  }

  createAuthorizationUrl(): { authorizationUrl: string } {
    const { authorizationUrl, clientId, scope, redirectUri } = this.options.oauthClient;
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      scope,
      redirect_uri: redirectUri,
    });

    return { authorizationUrl: `${authorizationUrl}?${params.toString()}` };
  }

  exchangeCodeForTokens(payload: LoginRequestDto): Promise<TokenResponseDto> {
    void payload;
    return Promise.reject(
      new NotImplementedException('OAuth2 code exchange is not implemented yet.'),
    );
  }

  refreshSession(refreshToken: string): Promise<TokenResponseDto> {
    void refreshToken;
    return Promise.reject(
      new NotImplementedException('Refresh token exchange is not implemented yet.'),
    );
  }

  async invalidateSession(userId: string): Promise<void> {
    const redis = this.redisService.getClient();
    await redis.del(this.sessionKey(userId));
  }

  async validateUser(userId: string): Promise<AuthenticatedUser> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['branch'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return mapUserEntityToAuthUser(user);
  }

  async validateSession(userId: string, sessionId: string): Promise<AuthenticatedUser> {
    const redis = this.redisService.getClient();
    const storedSession = await redis.get(this.sessionKey(userId));

    if (!storedSession || storedSession !== sessionId) {
      throw new UnauthorizedException('Invalid session');
    }

    return this.validateUser(userId);
  }

  private sessionKey(userId: string): string {
    return `${AUTH_CACHE_NAMESPACE}:${this.options.redisKeyPrefix}:${userId}`;
  }

  generateSessionId(): string {
    return randomUUID();
  }

  resolveOAuthProfile(profile: unknown): Promise<AuthenticatedUser> {
    void profile;
    return Promise.reject(
      new NotImplementedException('OAuth profile resolution is not implemented yet.'),
    );
  }
}
