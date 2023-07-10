import { AuthGuard } from '../../../auth/infra/http/auth.guard';
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { RecordsRequestDto } from './requests/records-request.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DeleteRecordUsecase } from '../../application/usecases/delete-record.usecase';
import {
  Record,
  RecordsByUserQuery,
} from '../../application/queries/records-by-user.query';
import { Where } from '@/shared/where';
import { OrderDirection } from '@/shared/orderby';
import { PaginatedResult } from '@/shared/paginated-list';

@Controller('records')
@ApiBearerAuth('Authentication')
@ApiTags('user records')
export class RecordsController {
  constructor(
    private readonly deleteRecordUsecase: DeleteRecordUsecase,
    @Inject('IRecordsByUserQuery')
    private readonly recordsByUserQuery: RecordsByUserQuery,
  ) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('/')
  async listRecords(
    @Req() request: Request,
    @Query() dto: RecordsRequestDto,
  ): Promise<PaginatedResult<Record>> {
    const where: Where<Record> = {};
    if (dto.operationType) where.operation = dto.operationType;
    const result = await this.recordsByUserQuery.execute(
      request['userId'],
      dto.skip,
      dto.take,
      where,
      [{ field: 'date', direction: OrderDirection.DESC }],
    );
    return result;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Delete('/:recordId')
  async deleteRecord(
    @Req() request: Request,
    @Param('recordId', new ParseUUIDPipe()) recordId: string,
  ): Promise<void> {
    await this.deleteRecordUsecase.execute(request['userId'], recordId);
  }
}
