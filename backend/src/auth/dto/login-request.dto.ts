import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class LoginRequestDto {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsUrl()
  redirectUri!: string;

  @IsString()
  @IsNotEmpty()
  codeVerifier!: string;

  @IsString()
  @IsNotEmpty()
  state!: string;
}
