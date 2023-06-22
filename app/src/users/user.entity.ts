import { Column, Entity, PrimaryColumn } from 'typeorm';
import { UserStatus } from './user-status.enum';

@Entity()
export class User {
  @PrimaryColumn('uuid')
  userId: string;

  @Column('text')
  userName: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
  })
  userStatus: UserStatus;

  @Column('integer')
  balance: number;

  @Column('text')
  password: string;
}
