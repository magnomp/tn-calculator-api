import { User } from '../domain/user';

export interface UserRepository {
  findByUserid(userId: string): Promise<User | undefined>;
  findByUsername(username: string): Promise<User | undefined>;
  save(user: User): Promise<void>;
}
