import { AuthGuard } from '../auth/auth.guard';
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
import { OperationsService } from './operations.service';
import { TwoOperands } from './dto/two-operands.dto';
import { DivisionOperands } from './dto/division-operands.dto';
import { SqrtOperandDto } from './dto/sqrt-operand.dto';
import { NotEnoughBalanceExceptionFilter } from './operations.exception-filters';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('operations')
@UseFilters(NotEnoughBalanceExceptionFilter)
@ApiBearerAuth()
@ApiTags('operations')
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('addition')
  async addition(
    @Req() request: Request,
    @Body() operands: TwoOperands,
  ): Promise<number> {
    return await this.operationsService.performAddition(
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
    return await this.operationsService.performSubtraction(
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
    return await this.operationsService.performMultiplication(
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
    return await this.operationsService.performDivision(
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
    return await this.operationsService.performSqrt(
      request['userId'],
      operand.radicand,
    );
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('randomString')
  async randomString(@Req() request: Request): Promise<string> {
    return await this.operationsService.performRandomString(request['userId']);
  }
}
