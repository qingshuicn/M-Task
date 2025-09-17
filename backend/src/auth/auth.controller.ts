import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { LoginRequestDto } from './dto/login-request.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import { AuthService } from './auth.service';
import { AuthenticatedUser } from './interfaces/auth-user.interface';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('authorize')
  beginLogin(): { authorizationUrl: string } {
    return this.authService.createAuthorizationUrl();
  }

  @Post('callback')
  completeLogin(@Body() payload: LoginRequestDto): Promise<TokenResponseDto> {
    return this.authService.exchangeCodeForTokens(payload);
  }

  @Post('refresh')
  refresh(@Body() payload: RefreshTokenDto): Promise<TokenResponseDto> {
    return this.authService.refreshSession(payload.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@CurrentUser() user: AuthenticatedUser): Promise<void> {
    await this.authService.invalidateSession(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: AuthenticatedUser): AuthenticatedUser {
    return user;
  }
}
