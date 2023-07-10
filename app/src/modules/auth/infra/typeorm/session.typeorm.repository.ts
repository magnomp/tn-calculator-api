import { Session as SessionTable } from './session.entity';
import { Session as SessionDomain } from '@/modules/auth/domain/session';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionRepository } from '../../application/repositories/session.repository';

@Injectable()
export class SessionRepositoryTypeOrm implements SessionRepository {
  constructor(
    @InjectRepository(SessionTable)
    private readonly typeormSessionRepository: Repository<SessionTable>,
  ) {}

  async save(session: SessionDomain): Promise<void> {
    await this.typeormSessionRepository.save(domainToTable(session));
  }

  async findByRefreshToken(
    refreshToken: string,
  ): Promise<SessionDomain | undefined> {
    const record = await this.typeormSessionRepository
      .createQueryBuilder('session')
      .andWhere('session.refreshToken = :refreshToken', { refreshToken })
      .getOne();

    return record ? tableToDomain(record) : undefined;
  }

  async findById(sessionId: string): Promise<SessionDomain | undefined> {
    const record = await this.typeormSessionRepository
      .createQueryBuilder('session')
      .andWhere('session.sessionId = :sessionId', { sessionId })
      .getOne();

    return record ? tableToDomain(record) : undefined;
  }
}

function domainToTable(session: SessionDomain): SessionTable {
  const record = new SessionTable();
  record.sessionId = session.sessionId;
  record.userId = session.userId;
  record.refreshToken = session.refreshToken;
  record.isActive = session.isActive;

  return record;
}

function tableToDomain(session: SessionTable): SessionDomain {
  return new SessionDomain(
    session.sessionId,
    session.userId,
    session.refreshToken,
    session.isActive,
  );
}
