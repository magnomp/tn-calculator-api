import * as crypto from 'crypto';

export class Session {
  private _refreshToken: string;
  private _isActive: boolean;

  get refreshToken() {
    return this._refreshToken;
  }

  get isActive() {
    return this._isActive;
  }

  renewRefreshToken() {
    this._refreshToken = crypto.randomUUID();
  }

  close() {
    this._isActive = false;
  }

  static newSessionForUser(userId: string): Session {
    return new Session(crypto.randomUUID(), userId, crypto.randomUUID(), true);
  }

  constructor(
    public readonly sessionId: string,
    public readonly userId: string,
    refreshToken: string,
    isActive: boolean,
  ) {
    this._isActive = isActive;
    this._refreshToken = refreshToken;
  }
}
