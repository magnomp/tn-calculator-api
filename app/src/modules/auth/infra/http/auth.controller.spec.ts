import { AuthController } from './auth.controller';
import * as mocks from 'node-mocks-http';
import sinon from 'sinon';
import { AuthenticateUsecase } from '@/modules/auth/application/usecases/authenticate-usecase';
import { InvalidCredentialsException } from '@/modules/auth/application/types/invalid-credentials.exception';
import { InvalidRefreshTokenException } from '@/modules/auth/application/types/invalid-refresh-token.exception';
import { RefreshTokenUsecase } from '../../application/usecases/refresh-token.usecase';
import { LogoutUsecase } from '../../application/usecases/logout.usecase';

describe('AuthController', () => {
  let controller: AuthController;
  let authenticateUsecase: sinon.SinonStubbedInstance<AuthenticateUsecase>;
  let refreshTokenUsecase: sinon.SinonStubbedInstance<RefreshTokenUsecase>;
  let logoutUsecase: sinon.SinonStubbedInstance<LogoutUsecase>;

  beforeEach(async () => {
    authenticateUsecase = sinon.createStubInstance(AuthenticateUsecase);
    refreshTokenUsecase = sinon.createStubInstance(RefreshTokenUsecase);
    logoutUsecase = sinon.createStubInstance(LogoutUsecase);
    controller = new AuthController(
      authenticateUsecase,
      refreshTokenUsecase,
      logoutUsecase,
    );
  });

  describe('login', () => {
    it('If login succeds, should return the token and set refresh token cookie', async () => {
      const res = mocks.createResponse();
      authenticateUsecase.execute
        .withArgs('foo', 'bar')
        .resolves({ accessToken: 'at', refreshToken: 'rt' });

      await controller.signIn(res, { username: 'foo', password: 'bar' });

      const rt = res.cookies['refreshtoken'];

      expect(rt).toBeDefined();
      expect(rt.value).toBe('rt');
      expect(rt.options.httpOnly);
    });

    it('If login fails, should return 401', async () => {
      const res = mocks.createResponse();
      authenticateUsecase.execute
        .withArgs('foo', 'bar')
        .rejects(new InvalidCredentialsException());

      await expect(
        controller.signIn(res, { username: 'foo', password: 'bar' }),
      ).resolves.toStrictEqual({ code: 'invalid-credentials' });
    });
  });

  describe('Refresh', () => {
    it('If refresh validates, return the new access token and set the new refresh token', async () => {
      const req = mocks.createRequest();
      const res = mocks.createResponse();

      req.cookies['refreshtoken'] = 'rt';

      refreshTokenUsecase.execute
        .withArgs('rt')
        .resolves({ accessToken: 'at2', refreshToken: 'rt2' });

      await controller.refresh(req, res);

      expect(res.cookies['refreshtoken'].value).toBe('rt2');
    });

    it('If refresh doesnt validate, return 401', async () => {
      const req = mocks.createRequest();
      const res = mocks.createResponse();

      req.cookies['refreshtoken'] = 'rt';

      refreshTokenUsecase.execute
        .withArgs('rt')
        .rejects(new InvalidRefreshTokenException());

      await expect(controller.refresh(req, res)).resolves.toStrictEqual({
        code: 'invalid-refresh-token',
      });
    });
  });
});
