import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
import { OperationType } from '../../shared/operation-type';
import { OperationsService } from '../services/operations.service';

@Injectable()
export class RandomStringUsecase {
  constructor(
    private readonly operationService: OperationsService,
    private readonly httpService: HttpService,
    @Inject('randomOrgEndpoint') private readonly randomOrgEndpoint: string,
  ) {}
  async execute(userId: string): Promise<string> {
    const result = firstValueFrom(
      this.httpService
        .get(
          `${this.randomOrgEndpoint}/strings/?num=1&len=8&digits=on&upperalpha=on&loweralpha=on&unique=on&format=plain&rnd=new`,
        )
        .pipe(map((response) => response.data as string)),
    );

    await this.operationService.performOperation(
      userId,
      OperationType.random_string,
      () => result,
    );

    return await result;
  }
}
