import { Type } from 'class-transformer';
import { IsNotIn, IsNumber, IsPositive } from 'class-validator';

export class DivisionOperands {
  @Type(() => Number)
  @IsNumber()
  dividend: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotIn([0])
  divisor: number;
}
