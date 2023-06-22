import { AuthGuard } from '../auth/auth.guard';
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { RecordsRequestDto } from './dto/records-request.dto';
import { RecordDto } from './dto/record.dto';
import { RecordsService } from './records.service';

@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('/')
  async listRecords(
    @Req() request: Request,
    @Query() dto: RecordsRequestDto,
  ): Promise<RecordDto[]> {
    return await this.recordsService.listRecords(request['userId'], dto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Delete('/:recordId')
  async deleteRecord(
    @Req() request: Request,
    @Param('recordId', new ParseUUIDPipe()) recordId: string,
  ): Promise<void> {
    const deleted = await this.recordsService.deleteRecord(
      request['userId'],
      recordId,
    );
    if (!deleted) throw new HttpException('not-found', HttpStatus.NOT_FOUND);
  }
}
