import { Column, Entity, PrimaryColumn } from 'typeorm';
import { OperationType } from './operation-type.enum';

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
