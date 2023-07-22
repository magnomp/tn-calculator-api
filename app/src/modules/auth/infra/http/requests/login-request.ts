import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class LoginRequest {
  @IsString()
  @Type(() => String)
  @ApiProperty({
    description: 'Username',
  })
  username: string;
  @IsString()
  @Type(() => String)
  @ApiProperty({
    description: 'Password',
  })
  password: string;
}
