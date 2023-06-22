import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByUsername(userName: string): Promise<User | undefined> {
    return await this.userRepository
      .createQueryBuilder('user')
      .andWhere('user.userName = :userName', { userName })
      .getOne();
  }

  async findById(userId: string): Promise<User | undefined> {
    return await this.userRepository
      .createQueryBuilder('user')
      .andWhere('user.userId = :userId', { userId })
      .getOne();
  }
}
