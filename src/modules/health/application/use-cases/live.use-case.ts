import { Injectable } from '@nestjs/common';
import { LiveOutputDto } from '../../dto/output/live.dto';
import * as os from 'os';

@Injectable()
export class LiveUseCase {
  execute(): LiveOutputDto {
    const timestamp = new Date();
    const cpus = os.cpus();
    const memoryUsage = os.freemem();
    const totalMemory = os.totalmem();

    const cpuUsage =
      cpus.length > 0 ? cpus[0].times : { user: 0, sys: 0, idle: 1 };

    return {
      status: 'alive',
      timestamp: timestamp,
      details: {
        process_id: process.pid,
        memory_usage: `${Math.round((totalMemory - memoryUsage) / 1024 / 1024)} MB`,
        cpu_usage: `${Math.round(((cpuUsage.user + cpuUsage.sys) / (cpuUsage.user + cpuUsage.sys + cpuUsage.idle)) * 100)}%`,
      },
    };
  }
}
