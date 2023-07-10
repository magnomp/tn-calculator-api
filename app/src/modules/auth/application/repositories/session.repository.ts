import { Session } from '@/modules/auth/domain/session';

export interface SessionRepository {
  save(session: Session): Promise<void>;
  findByRefreshToken(refreshToken: string): Promise<Session | undefined>;
  findById(sessionId: string): Promise<Session | undefined>;
}
