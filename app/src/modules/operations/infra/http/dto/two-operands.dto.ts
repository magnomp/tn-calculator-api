import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class TwoOperands {
  @Type(() => Number)
  @IsNumber()
  a: number;

  @Type(() => Number)
  @IsNumber()
  b: number;
}
