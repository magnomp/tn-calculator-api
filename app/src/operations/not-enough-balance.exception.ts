export class NotEnoughBalanceException extends Error {
  type = 'not-enough-balance';
  constructor(
    public readonly currentBalance: number,
    public readonly cost: number,
  ) {
    super(`This operation costs ${cost} but you only have ${currentBalance}`);
  }
}

export function exceptionIsNotEnoughBalanceException(
  exception: Error,
): exception is NotEnoughBalanceException {
  return exception['type'] == 'not-enough-balance';
}
