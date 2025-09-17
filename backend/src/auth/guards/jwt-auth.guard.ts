import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ACCESS_TOKEN_STRATEGY } from '../auth.constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard(ACCESS_TOKEN_STRATEGY) {}
