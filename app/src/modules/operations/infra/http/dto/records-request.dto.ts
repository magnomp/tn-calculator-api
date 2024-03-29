import { OperationType } from '@/modules/operations/shared/operation-type';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

export class RecordsRequestDto {
  @IsInt()
  @Type(() => Number)
  @Min(0)
  skip: number;

  @IsInt()
  @Type(() => Number)
  @Min(1)
  take: number;

  @IsEnum(OperationType)
  @IsOptional()
  operationType?: OperationType;
}
