import { Inject, Injectable } from '@nestjs/common';
import { SessionRepository } from '../repositories/session.repository';

@Injectable()
export class LogoutUsecase {
  constructor(
    @Inject('ISessionRepository')
    private readonly sessionRepository: SessionRepository,
  ) {}

  async execute(sessionId: string): Promise<void> {
    const session = await this.sessionRepository.findById(sessionId);
    session.close();
    await this.sessionRepository.save(session);
  }
}
