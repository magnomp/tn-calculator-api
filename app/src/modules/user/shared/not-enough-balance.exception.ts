export class NotEnoughBalanceException extends Error {
  constructor(
    public readonly currentBalance: number,
    public readonly cost: number,
  ) {
    super(`This operation costs ${cost} but you only have ${currentBalance}`);
  }
}
