import { createNewDatabase, dropDatabase } from '@/integration/connection';
import { DataSource } from 'typeorm';
import { Session as SessionTable } from './session.entity';
import { Session as SessionDomain } from '@/modules/auth/domain/session';
import { SessionRepositoryTypeOrm } from './session.typeorm.repository';

describe('SessionRepositoryTypeOrm', () => {
  let datasource: DataSource;
  let repo: SessionRepositoryTypeOrm;
  beforeAll(async () => {
    datasource = await createNewDatabase();
  });

  afterAll(async () => {
    await dropDatabase(datasource);
  });

  beforeEach(() => {
    repo = new SessionRepositoryTypeOrm(datasource.getRepository(SessionTable));
  });

  describe('save', () => {
    it('Should insert a session on database if not exist', async () => {
      const session = SessionDomain.newSessionForUser(
        'a0b177e3-f02a-44c9-9d05-62d450da9b26',
      );
      await repo.save(session);

      const fromDb = await datasource
        .createQueryBuilder(SessionTable, 'session')
        .andWhere('session.sessionId = :sessionId', {
          sessionId: session.sessionId,
        })
        .getOne();

      expect(fromDb).toBeDefined();
      expect(fromDb.sessionId).toBe(session.sessionId);
      expect(fromDb.userId).toBe(session.userId);
      expect(fromDb.isActive).toBe(true);
    });
  });
});
