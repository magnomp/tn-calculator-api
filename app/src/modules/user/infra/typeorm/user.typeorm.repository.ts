import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from '../../application/user.repository';
import { User as UserDomain } from '../../domain/user';
import { User } from './user.entity';

@Injectable()
export class UserRepositoryTypeOrm implements UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly typeOrmUserRepository: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<UserDomain | undefined> {
    const user = await this.typeOrmUserRepository
      .createQueryBuilder('user')
      .andWhere('user.userName = :username', { username })
      .getOne();

    return user ? tableToDomain(user) : undefined;
  }

  async findByUserid(userId: string): Promise<UserDomain> {
    const user = await this.typeOrmUserRepository
      .createQueryBuilder('user')
      .andWhere('user.userId = :userId', { userId })
      .getOne();

    return user ? tableToDomain(user) : undefined;
  }

  async save(user: UserDomain): Promise<void> {
    await this.typeOrmUserRepository.save(domainToTable(user));
  }
}

function tableToDomain(user: User): UserDomain {
  return new UserDomain(
    user.userId,
    user.userName,
    user.userStatus,
    user.balance,
    user.password,
  );
}

function domainToTable(user: UserDomain): User {
  return {
    userId: user.id,
    userName: user.username,
    userStatus: user.status,
    balance: user.balance,
    password: user.password,
  };
}
