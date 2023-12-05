import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { RefreshJwtAuthGuard } from '../guards/refresh-jwt-auth.guard';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from '../dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 201,
    description: 'Successfully logged in, access token created',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access' })
  async login(@Req() req: any) {
    return await this.authService.login(req.user);
  }

  @Post('refresh')
  @UseGuards(RefreshJwtAuthGuard)
  @ApiBody({
    schema: { type: 'object', properties: { refresh: { type: 'string' } } },
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully logged in, access token created',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access' })
  async refreshToken(@Req() req: any) {
    return this.authService.refresh(req.user);
  }
}
