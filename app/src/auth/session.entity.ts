import { User } from '../users/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Session {
  @PrimaryColumn('uuid')
  sessionId: string;

  @Column('uuid')
  userId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('text')
  refreshToken: string;

  @Column('boolean')
  isActive: boolean;
}
