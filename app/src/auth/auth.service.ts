import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { TokensDto } from './dto/tokens.dto';
import { InvalidCredentialsException } from './exception/invalid-credentials.exception';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { Session } from './session.entity';
import { InvalidRefreshTokenException } from './exception/invalid-refresh-token.exception';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async signIn(username: string, pass: string): Promise<TokensDto> {
    const user = await this.usersService.findByUsername(username);
    if (!user) throw new InvalidCredentialsException();
    const passwordMatches = await bcrypt.compare(pass, user.password);

    if (!passwordMatches) throw new InvalidCredentialsException();

    const session = new Session();
    session.sessionId = crypto.randomUUID();
    session.userId = user.userId;
    session.isActive = true;
    session.refreshToken = crypto.randomUUID();
    await this.sessionRepository.save(session);

    const payload = {
      sub: user.userId,
      sid: session.sessionId,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken, refreshToken: session.refreshToken };
  }

  async refresh(refreshToken: string): Promise<TokensDto> {
    const session = await this.sessionRepository
      .createQueryBuilder('session')
      .andWhere('session.refreshToken = :refreshToken', { refreshToken })
      .getOne();

    if (!session || !session.isActive) throw new InvalidRefreshTokenException();

    session.refreshToken = crypto.randomUUID();

    const payload = {
      sub: session.userId,
      sid: session.sessionId,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    await this.sessionRepository.save(session);

    return { accessToken, refreshToken: session.refreshToken };
  }

  async logout(sessionId: string): Promise<void> {
    const session = await this.sessionRepository
      .createQueryBuilder('session')
      .andWhere('session.sessionId = :sessionId', { sessionId })
      .getOne();

    if (session) {
      session.isActive = false;
      await this.sessionRepository.save(session);
    }
  }
}
