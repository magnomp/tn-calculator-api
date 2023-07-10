import { User } from '@/modules/user/domain/user';
import { Operation } from './operation';
import crypto from 'crypto';

export class Record {
  private _isDeleted: boolean;

  constructor(
    public readonly recordId: string,
    public readonly userId: string,
    public readonly operationId: string,
    public readonly amount: number,
    public readonly userBalance: number,
    public readonly operationResponse: string,
    public readonly date: Date,
    isDeleted: boolean,
  ) {
    this._isDeleted = isDeleted;
  }

  get isDeleted(): boolean {
    return this._isDeleted;
  }

  markAsDeleted(): void {
    this._isDeleted = true;
  }

  static async fromOperation(
    operation: Operation,
    user: User,
    result: () => Promise<string>,
  ): Promise<Record> {
    user.registerDebit(operation.cost);
    return new Record(
      crypto.randomUUID(),
      user.id,
      operation.operationId,
      operation.cost,
      user.balance,
      await result(),
      new Date(),
      false,
    );
  }
}
