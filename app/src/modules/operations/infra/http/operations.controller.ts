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
import { DivisionOperands } from './dto/division-operands.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdditionUsecase } from '../../application/usecases/addition-usecase';
import { SubtractionUsecase } from '../../application/usecases/subtraction-usecase';
import { MultiplicationUsecase } from '../../application/usecases/multiplication-usecase';
import { DivisionUsecase } from '../../application/usecases/division-usecase';
import { SqrtUsecase } from '../../application/usecases/square-root-usecase';
import { RandomStringUsecase } from '../../application/usecases/random-string-usecase';
import { TwoOperands } from './dto/two-operands.dto';
import { SqrtOperandDto } from './dto/sqrt-operand.dto';
import { HTTP_STATUS_NOT_ENOUGH_FUNDS } from './custom-status-codes';
import { NotEnoughBalanceExceptionFilter } from './not-enough-balance.exceptionfilter';

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
  @ApiOperation({
    description: 'Performs a + b',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'If user had enough funds return the operation result',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'If not authenticated or token expired',
  })
  @ApiResponse({
    status: HTTP_STATUS_NOT_ENOUGH_FUNDS,
    description: 'If user has not enough funds',
  })
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
  @ApiOperation({
    description: 'Performs a - b',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'If user had enough funds return the operation result',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'If not authenticated or token expired',
  })
  @ApiResponse({
    status: HTTP_STATUS_NOT_ENOUGH_FUNDS,
    description: 'If user has not enough funds',
  })
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
  @ApiOperation({
    description: 'Performs a * b',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'If user had enough funds return the operation result',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'If not authenticated or token expired',
  })
  @ApiResponse({
    status: HTTP_STATUS_NOT_ENOUGH_FUNDS,
    description: 'If user has not enough funds',
  })
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
  @ApiOperation({
    description: 'Performs dividend / divisor',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'If user had enough funds return the operation result',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'If not authenticated or token expired',
  })
  @ApiResponse({
    status: HTTP_STATUS_NOT_ENOUGH_FUNDS,
    description: 'If user has not enough funds',
  })
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
  @ApiOperation({
    description: 'Performs sqrt(radicand)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'If user had enough funds return the operation result',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'If not authenticated or token expired',
  })
  @ApiResponse({
    status: HTTP_STATUS_NOT_ENOUGH_FUNDS,
    description: 'If user has not enough funds',
  })
  async sqrt(
    @Req() request: Request,
    @Body() operand: SqrtOperandDto,
  ): Promise<number> {
    return await this.sqrtUsecase.execute(request['userId'], operand.radicand);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('randomString')
  @ApiOperation({
    description: 'Generate and returns a truly random number',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'If user had enough funds return the operation result',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'If not authenticated or token expired',
  })
  @ApiResponse({
    status: HTTP_STATUS_NOT_ENOUGH_FUNDS,
    description: 'If user has not enough funds',
  })
  async randomString(@Req() request: Request): Promise<string> {
    return await this.randomStringUsecase.execute(request['userId']);
  }
}
