import { ApiProperty } from '@nestjs/swagger';

export class NotEnoughBalanceDto {
  @ApiProperty({
    description: 'How much balance do the user have',
  })
  currentBalance: number;

  @ApiProperty({
    description: 'How much did the operation costs',
  })
  cost: number;
}
