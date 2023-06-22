import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class SqrtOperandDto {
  @Type(() => Number)
  @Min(0)
  @IsNumber()
  radicand: number;
}
