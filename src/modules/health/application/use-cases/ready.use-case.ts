import { Injectable } from '@nestjs/common';
import { ReadyOutputDto } from '../../dto/output/ready.dto';

@Injectable()
export class ReadyUseCase {
  execute(): ReadyOutputDto {
    const timestamp = new Date();

    return {
      status: 'ready',
      ready: true,
      dependencies: {
        database: true,
        redis: true,
        external_api: false,
      },
    };
  }
}
