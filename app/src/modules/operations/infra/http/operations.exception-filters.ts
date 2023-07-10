import { NotEnoughBalanceException } from '@/modules/user/shared/not-enough-balance.exception';
import { ExceptionFilter, HttpStatus } from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common';
import { Catch } from '@nestjs/common';
import { Response } from 'express';

@Catch(NotEnoughBalanceException)
export class NotEnoughBalanceExceptionFilter implements ExceptionFilter {
  catch(exception: NotEnoughBalanceException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.BAD_REQUEST).json({
      error: 'not-enough-balance',
      required: exception.cost,
      available: exception.currentBalance,
    });
  }
}
