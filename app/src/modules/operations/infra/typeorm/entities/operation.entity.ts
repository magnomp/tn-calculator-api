import { OperationType } from '@/modules/operations/shared/operation-type';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Operation {
  @PrimaryColumn('uuid')
  operationId: string;

  @Column({
    type: 'enum',
    enum: OperationType,
  })
  operationType: OperationType;

  @Column('integer')
  cost: number;
}
