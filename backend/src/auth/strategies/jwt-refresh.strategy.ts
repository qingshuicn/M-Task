import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { REFRESH_TOKEN_STRATEGY } from '../auth.constants';
import { AuthService } from '../auth.service';
import { AuthenticatedUser } from '../interfaces/auth-user.interface';
import { AuthModuleOptions } from '../interfaces/auth-module-options.interface';

interface RefreshTokenPayload {
  sub: string;
  sessionId: string;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, REFRESH_TOKEN_STRATEGY) {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    const options = configService.get<AuthModuleOptions>('auth');
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: options?.jwt.publicKey,
      algorithms: ['RS256'],
      audience: options?.jwt.audience,
      issuer: options?.jwt.issuer,
    });
  }

  async validate(payload: RefreshTokenPayload): Promise<AuthenticatedUser> {
    return this.authService.validateSession(payload.sub, payload.sessionId);
  }
}
