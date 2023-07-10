import { UserRepository } from '@/modules/user/application/user.repository';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SessionRepository } from '../repositories/session.repository';
import { AuthenticationDetails } from '../types/authentication-details';
import { InvalidRefreshTokenException } from '../types/invalid-refresh-token.exception';

@Injectable()
export class RefreshTokenUsecase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: UserRepository,
    @Inject('ISessionRepository')
    private readonly sessionRepository: SessionRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(refreshToken: string): Promise<AuthenticationDetails> {
    const session = await this.sessionRepository.findByRefreshToken(
      refreshToken,
    );

    if (!session) throw new InvalidRefreshTokenException();

    if (!session.isActive) throw new InvalidRefreshTokenException();

    session.renewRefreshToken();

    this.sessionRepository.save(session);

    const user = await this.userRepository.findByUserid(session.userId);

    const payload = {
      sub: session.userId,
      sid: session.sessionId,
      email: user.username,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken, refreshToken: session.refreshToken };
  }
}
