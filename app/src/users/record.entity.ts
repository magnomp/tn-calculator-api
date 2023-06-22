import { Operation } from '../operations/operation.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Record {
  @PrimaryColumn('uuid')
  recordId: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  operationId: string;

  @OneToOne(() => Operation)
  @JoinColumn({ name: 'operationId' })
  operation: Operation;

  // How much did this operation cost?
  @Column('integer')
  amount: number;

  // What was the user balance AFTER performing this operation?
  @Column('integer')
  userBalance: number;

  @Column('text')
  operationResponse: string;

  @Column('timestamptz')
  date: Date;

  @Column('boolean')
  isDeleted: boolean;
}
