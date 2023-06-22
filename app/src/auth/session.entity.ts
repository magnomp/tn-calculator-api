import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Session {
  @PrimaryColumn('uuid')
  sessionId: string;

  @Column('uuid')
  userId: string;

  @Column('text')
  refreshToken: string;

  @Column('boolean')
  isActive: boolean;
}
