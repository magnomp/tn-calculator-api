import { Session } from './session';

describe('Session', () => {
  describe('newSessionForUser', () => {
    it('Should return an active session for the given user', () => {
      const session = Session.newSessionForUser('user-id');
      expect(session.userId).toBe('user-id');
      expect(session.isActive).toBe(true);
    });
  });
});
