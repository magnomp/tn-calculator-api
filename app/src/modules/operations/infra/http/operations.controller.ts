import { AuthGuard } from '../../../auth/infra/http/auth.guard';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { DivisionOperands } from './requests/division-operands.dto';
import { NotEnoughBalanceExceptionFilter } from './operations.exception-filters';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdditionUsecase } from '../../application/usecases/addition-usecase';
import { SubtractionUsecase } from '../../application/usecases/subtraction-usecase';
import { MultiplicationUsecase } from '../../application/usecases/multiplication-usecase';
import { DivisionUsecase } from '../../application/usecases/division-usecase';
import { SqrtUsecase } from '../../application/usecases/square-root-usecase';
import { RandomStringUsecase } from '../../application/usecases/random-string-usecase';
import { TwoOperands } from './requests/two-operands.dto';
import { SqrtOperandDto } from './requests/sqrt-operand.dto';

@Controller('operations')
@UseFilters(NotEnoughBalanceExceptionFilter)
@ApiBearerAuth()
@ApiTags('operations')
export class OperationsController {
  constructor(
    private readonly additionUsecase: AdditionUsecase,
    private readonly subtractionUsecase: SubtractionUsecase,
    private readonly multiplicationUsecase: MultiplicationUsecase,
    private readonly divisionUsecase: DivisionUsecase,
    private readonly sqrtUsecase: SqrtUsecase,
    private readonly randomStringUsecase: RandomStringUsecase,
  ) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('addition')
  async addition(
    @Req() request: Request,
    @Body() operands: TwoOperands,
  ): Promise<number> {
    return await this.additionUsecase.execute(
      request['userId'],
      operands.a,
      operands.b,
    );
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('subtraction')
  async subtraction(
    @Req() request: Request,
    @Body() operands: TwoOperands,
  ): Promise<number> {
    return await this.subtractionUsecase.execute(
      request['userId'],
      operands.a,
      operands.b,
    );
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('multiplication')
  async multiplication(
    @Req() request: Request,
    @Body() operands: TwoOperands,
  ): Promise<number> {
    return await this.multiplicationUsecase.execute(
      request['userId'],
      operands.a,
      operands.b,
    );
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('division')
  async division(
    @Req() request: Request,
    @Body() operands: DivisionOperands,
  ): Promise<number> {
    return await this.divisionUsecase.execute(
      request['userId'],
      operands.dividend,
      operands.divisor,
    );
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('sqrt')
  async sqrt(
    @Req() request: Request,
    @Body() operand: SqrtOperandDto,
  ): Promise<number> {
    return await this.sqrtUsecase.execute(request['userId'], operand.radicand);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('randomString')
  async randomString(@Req() request: Request): Promise<string> {
    return await this.randomStringUsecase.execute(request['userId']);
  }
}
