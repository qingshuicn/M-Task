import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import OAuth2Strategy, { StrategyOptions } from 'passport-oauth2';

import { OAUTH_PKCE_STRATEGY } from '../auth.constants';
import { AuthService } from '../auth.service';
import { AuthenticatedUser } from '../interfaces/auth-user.interface';
import { AuthModuleOptions } from '../interfaces/auth-module-options.interface';

@Injectable()
export class OAuthPkceStrategy extends PassportStrategy(OAuth2Strategy, OAUTH_PKCE_STRATEGY) {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    const options = configService.get<AuthModuleOptions>('auth');
    const strategyOptions: StrategyOptions = {
      authorizationURL: options?.oauthClient.authorizationUrl ?? '',
      tokenURL: options?.oauthClient.tokenUrl ?? '',
      clientID: options?.oauthClient.clientId ?? '',
      clientSecret: options?.oauthClient.clientSecret ?? '',
      callbackURL: options?.oauthClient.redirectUri ?? '',
    };

    super(
      strategyOptions,
      async (
        accessToken: string,
        refreshToken: string,
        results: Record<string, unknown>,
        profile: Record<string, unknown>,
        done: OAuth2Strategy.VerifyCallback,
      ) => {
        void accessToken;
        void refreshToken;
        void results;

        try {
          const user: AuthenticatedUser = await this.authService.resolveOAuthProfile(profile);
          done(null, user);
        } catch (error: unknown) {
          done(error instanceof Error ? error : new Error('Failed to resolve OAuth profile'));
        }
      },
    );
  }
}
