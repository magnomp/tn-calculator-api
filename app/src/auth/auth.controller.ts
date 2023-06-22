import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() dto: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    console.log(dto);
    try {
      const tokens = await this.authService.signIn(dto.username, dto.password);

      response.cookie('refreshtoken', tokens.refreshToken, {
        httpOnly: true,
        secure: false, // Ideally should be true, but in order to ease development...
      });

      return { accessToken: tokens.accessToken };
    } catch (e) {
      if (e.type == 'invalid-credentials') {
        throw new HttpException('invalid-credentials', HttpStatus.UNAUTHORIZED);
      } else {
        console.log(e);
        throw e;
      }
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    try {
      const tokens = await this.authService.refresh(
        request.cookies['refreshtoken'],
      );

      response.cookie('refreshtoken', tokens.refreshToken, {
        httpOnly: true,
        secure: false, // Ideally should be true, but in order to ease development...
      });

      return { accessToken: tokens.accessToken };
    } catch (e) {
      if (e.type == 'invalid-refresh-token') {
        throw new HttpException(
          'invalid-refresh-token',
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        throw e;
      }
    }
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.authService.logout(request['sessionId']);
    response.clearCookie('refreshtoken');
  }
}
