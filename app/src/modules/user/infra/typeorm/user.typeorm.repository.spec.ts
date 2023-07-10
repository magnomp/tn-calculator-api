import { createNewDatabase, dropDatabase } from '@/integration/connection';
import { DataSource } from 'typeorm';
import { User } from './user.entity';
import { UserStatus } from './user-status';
import { UserRepositoryTypeOrm } from './user.typeorm.repository';

describe('UserRepositoryTypeOrm', () => {
  let datasource: DataSource;
  let repo: UserRepositoryTypeOrm;
  beforeAll(async () => {
    datasource = await createNewDatabase();
  });

  afterAll(async () => {
    await dropDatabase(datasource);
  });

  beforeEach(() => {
    repo = new UserRepositoryTypeOrm(datasource.getRepository(User));
  });

  describe('findByUsername', () => {
    it('Return a user provided it exists', async () => {
      const user = await repo.findByUsername('demo1@tn.com');
      expect(user).toBeDefined();
    });

    it('Return undefined if the user does not exist', async () => {
      const user = await repo.findByUsername('foo');
      expect(user).toBeUndefined();
    });
  });

  describe('findByUserid', () => {
    it('Return a user provided it exists', async () => {
      const expected = new User();
      expected.userId = 'cd99308e-f18f-497d-9937-dc5d37583bf5';
      expected.password = 'a';
      expected.userName = 'b';
      expected.balance = 10;
      expected.userStatus = UserStatus.ACTIVE;

      await datasource.getRepository(User).save(expected);

      const user = await repo.findByUserid(
        'cd99308e-f18f-497d-9937-dc5d37583bf5',
      );

      expect(user).toBeDefined();
      expect(user.id).toBe('cd99308e-f18f-497d-9937-dc5d37583bf5');
      expect(user.password).toBe('a');
      expect(user.username).toBe('b');
      expect(user.balance).toBe(10);
      expect(user.status).toBe(UserStatus.ACTIVE);
    });

    it('Return undefined if the user does not exist', async () => {
      const user = await repo.findByUserid(
        '6c1246fc-9dbe-416d-a6b0-57408ed83549',
      );
      expect(user).toBeUndefined();
    });
  });
});
