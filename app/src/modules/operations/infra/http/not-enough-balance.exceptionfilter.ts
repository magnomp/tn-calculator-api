import { NotEnoughBalanceException } from '@/modules/user/shared/not-enough-balance.exception';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { HTTP_STATUS_NOT_ENOUGH_FUNDS } from './custom-status-codes';
import { NotEnoughBalanceDto } from './dto/not-enough-balance-response.dto';

@Catch(NotEnoughBalanceException)
export class NotEnoughBalanceExceptionFilter implements ExceptionFilter {
  catch(exception: NotEnoughBalanceException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const responsePayload: NotEnoughBalanceDto = {
      cost: exception.cost,
      currentBalance: exception.currentBalance,
    };
    response.status(HTTP_STATUS_NOT_ENOUGH_FUNDS).json(responsePayload);
  }
}
