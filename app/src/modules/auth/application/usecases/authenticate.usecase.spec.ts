import { AuthenticateUsecase } from './authenticate.usecase';
import * as sinon from 'sinon';
import { SessionRepository } from '../repositories/session.repository';
import { JwtService } from '@nestjs/jwt';
import { User } from '@/modules/user/domain/user';
import { Session } from '../../domain/session';
import { UserStatus } from '@/modules/user/domain/user-status';
import { InvalidCredentialsException } from '../types/invalid-credentials.exception';
import { UserRepository } from '@/modules/user/application/user.repository';

describe('AuthenticateUsecase', () => {
  const userRepository: sinon.SinonStubbedInstance<UserRepository> = {
    findByUsername: sinon.stub(),
    findByUserid: sinon.stub(),
    save: sinon.stub(),
  };

  const sessionRepository: sinon.SinonStubbedInstance<SessionRepository> = {
    save: sinon.stub(),
    findByRefreshToken: sinon.stub(),
    findById: sinon.stub(),
  };

  const jwtService = sinon.createStubInstance(JwtService);

  let usecase: AuthenticateUsecase;

  beforeEach(() => {
    usecase = new AuthenticateUsecase(
      userRepository,
      sessionRepository,
      jwtService,
    );
  });

  afterEach(() => {
    sinon.reset();
  });

  it('Should start a new session and return tokens if login succeds', async () => {
    userRepository.findByUsername
      .withArgs('b')
      .resolves(
        new User(
          'a',
          'b',
          UserStatus.ACTIVE,
          10,
          '$2b$10$7/yg4B8ju3ro/mGZ/0wpauwj04kKGh7w8pSrB3rlADiRrbBJ.s2ZK',
        ),
      );

    jwtService.signAsync.withArgs(sinon.match.any).resolves('a jwt token');

    const result = await usecase.execute('b', '1234');

    sinon.assert.calledOnce(sessionRepository.save);
    const session = sessionRepository.save.getCalls().at(0).args[0] as Session;

    sinon.assert.calledOnceWithMatch(jwtService.signAsync, {
      sub: 'a',
      sid: session.sessionId,
      email: 'b',
    });

    expect(result.accessToken).toBe('a jwt token');
    expect(result.refreshToken).toBe(session.refreshToken);
  });

  it('Should throw if user doesn`t exist', async () => {
    userRepository.findByUsername.withArgs('b').resolves(undefined);

    await expect(() => usecase.execute('b', '1234')).rejects.toThrow(
      InvalidCredentialsException,
    );
  });

  it('Should throw if password doesnt match', async () => {
    userRepository.findByUsername
      .withArgs('b')
      .resolves(
        new User(
          'a',
          'b',
          UserStatus.ACTIVE,
          10,
          '$2b$10$7/yg4B8ju3ro/mGZ/0wpauwj04kKGh7w8pSrB3rlADiRrbBJ.s2ZK',
        ),
      );

    await expect(() => usecase.execute('b', '12345')).rejects.toThrow(
      InvalidCredentialsException,
    );
  });
});
