import { NotEnoughBalanceException } from '../shared/not-enough-balance.exception';
import { UserStatus } from './user-status';

export class User {
  constructor(
    public readonly id: string,
    public username: string,
    public readonly status: UserStatus,
    balance: number,
    public password: string,
  ) {
    this._balance = balance;
  }

  private _balance: number;

  get balance() {
    return this._balance;
  }

  registerDebit(amount: number) {
    if (this._balance < amount)
      throw new NotEnoughBalanceException(this._balance, amount);
    this._balance -= amount;
  }
}
