import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  @HttpCode(HttpStatus.OK)
  @Get('healthcheck')
  @ApiTags('misc')
  health(): string {
    return 'OK';
  }
}
