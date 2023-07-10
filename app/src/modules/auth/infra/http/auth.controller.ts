import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginResponse } from './responses/login-response';
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticateUsecase } from '../../application/usecases/authenticate.usecase';
import { OrError } from '@/shared/or-error';
import { LoginRequest } from './requests/login-request';
import { InvalidCredentialsException } from '@/modules/auth/application/types/invalid-credentials.exception';
import { InvalidRefreshTokenException } from '@/modules/auth/application/types/invalid-refresh-token.exception';
import { RefreshTokenUsecase } from '@/modules/auth/application/usecases/refresh-token.usecase';
import { LogoutUsecase } from '../../application/usecases/logout.usecase';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authenticateUsecase: AuthenticateUsecase,
    private readonly refreshTokenUsecase: RefreshTokenUsecase,
    private readonly logoutUsecase: LogoutUsecase,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() body: LoginRequest,
  ): Promise<OrError<LoginResponse>> {
    try {
      const tokens = await this.authenticateUsecase.execute(
        body.username,
        body.password,
      );

      response.cookie('refreshtoken', tokens.refreshToken, {
        httpOnly: true,
        secure: false, // Ideally should be true, but in order to ease development...
      });

      return { accessToken: tokens.accessToken };
    } catch (e) {
      if (e instanceof InvalidCredentialsException) {
        response.status(HttpStatus.UNAUTHORIZED);
        return { code: 'invalid-credentials' };
      } else {
        throw e;
      }
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<OrError<LoginResponse>> {
    try {
      const tokens = await this.refreshTokenUsecase.execute(
        request.cookies['refreshtoken'],
      );

      response.cookie('refreshtoken', tokens.refreshToken, {
        httpOnly: true,
        secure: false, // Ideally should be true, but in order to ease development...
      });

      return { accessToken: tokens.accessToken };
    } catch (e) {
      if (e instanceof InvalidRefreshTokenException) {
        response.status(HttpStatus.UNAUTHORIZED);
        return { code: 'invalid-refresh-token' };
      } else {
        throw e;
      }
    }
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.logoutUsecase.execute(request['sessionId']);
    response.clearCookie('refreshtoken');
  }
}
