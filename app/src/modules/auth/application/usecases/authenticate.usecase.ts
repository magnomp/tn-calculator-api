import * as bcrypt from 'bcrypt';
import { Inject, Injectable } from '@nestjs/common';
import { AuthenticationDetails } from '../types/authentication-details';
import { InvalidCredentialsException } from '../types/invalid-credentials.exception';
import { JwtService } from '@nestjs/jwt';
import { Session } from '@/modules/auth/domain/session';
import { SessionRepository } from '../repositories/session.repository';
import { UserRepository } from '@/modules/user/application/user.repository';

@Injectable()
export class AuthenticateUsecase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: UserRepository,
    @Inject('ISessionRepository')
    private readonly sessionRepository: SessionRepository,
    private readonly jwtService: JwtService,
  ) {}
  async execute(
    username: string,
    password: string,
  ): Promise<AuthenticationDetails> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) throw new InvalidCredentialsException();
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) throw new InvalidCredentialsException();

    const session = Session.newSessionForUser(user.id);

    await this.sessionRepository.save(session);

    const payload = {
      sub: session.userId,
      sid: session.sessionId,
      email: user.username,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken, refreshToken: session.refreshToken };
  }
}
