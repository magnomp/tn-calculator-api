import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import * as mocks from 'node-mocks-http';
import sinon from 'sinon';
import { InvalidCredentialsException } from './exception/invalid-credentials.exception';
import { HttpException } from '@nestjs/common';
import { InvalidRefreshTokenException } from './exception/invalid-refresh-token.exception';

describe('AuthController', () => {
  let controller: AuthController;
  let service: sinon.SinonStubbedInstance<AuthService>;

  beforeEach(async () => {
    service = sinon.createStubInstance(AuthService);
    controller = new AuthController(service);
  });

  describe('login', () => {
    it('If login succeds, should return the token and set refresh token cookie', async () => {
      const res = mocks.createResponse();
      service.signIn
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
      service.signIn
        .withArgs('foo', 'bar')
        .rejects(new InvalidCredentialsException());

      await expect(
        controller.signIn(res, { username: 'foo', password: 'bar' }),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('Refresh', () => {
    it('If refresh validates, return the new access token and set the new refresh token', async () => {
      const req = mocks.createRequest();
      const res = mocks.createResponse();

      req.cookies['refreshtoken'] = 'rt';

      service.refresh
        .withArgs('rt')
        .resolves({ accessToken: 'at2', refreshToken: 'rt2' });

      await controller.refresh(req, res);

      expect(res.cookies['refreshtoken'].value).toBe('rt2');
    });

    it('If refresh doesnt validate, return 401', async () => {
      const req = mocks.createRequest();
      const res = mocks.createResponse();

      req.cookies['refreshtoken'] = 'rt';

      service.refresh
        .withArgs('rt')
        .rejects(new InvalidRefreshTokenException());

      await expect(controller.refresh(req, res)).rejects.toThrow(HttpException);
    });
  });
});
