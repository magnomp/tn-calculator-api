import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class LoginRequest {
  @IsString()
  @Type(() => String)
  username: string;
  @IsString()
  @Type(() => String)
  password: string;
}
