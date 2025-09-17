import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ACCESS_TOKEN_STRATEGY } from '../auth.constants';
import { AuthService } from '../auth.service';
import { AuthenticatedUser } from '../interfaces/auth-user.interface';
import { AuthModuleOptions } from '../interfaces/auth-module-options.interface';

interface AccessTokenPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
  branchId: string;
}

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, ACCESS_TOKEN_STRATEGY) {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    const options = configService.get<AuthModuleOptions>('auth');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: options?.jwt.publicKey,
      algorithms: ['RS256'],
      audience: options?.jwt.audience,
      issuer: options?.jwt.issuer,
    });
  }

  async validate(payload: AccessTokenPayload): Promise<AuthenticatedUser> {
    return this.authService.validateUser(payload.sub);
  }
}
