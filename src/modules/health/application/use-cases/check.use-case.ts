import { Injectable } from '@nestjs/common';
import { CheckOutputDto } from '../../dto/output/check.dto';

@Injectable()
export class CheckUseCase {
  execute(): CheckOutputDto {
    const timestamp = new Date();

    return {
      status: 'OK',
      timestamp: timestamp,
      uptime: process.uptime(),
    };
  }
}
