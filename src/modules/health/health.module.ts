import { Module } from '@nestjs/common';
import { CheckController } from './presentation/controllers/check.controller';
import { CheckUseCase } from './application/use-cases/check.use-case';
import { LiveUseCase } from './application/use-cases/live.use-case';
import { ReadyUseCase } from './application/use-cases/ready.use-case';
import { LiveController } from './presentation/controllers/live.controller';
import { ReadyController } from './presentation/controllers/ready.controller';

@Module({
  controllers: [CheckController, ReadyController, LiveController],
  providers: [CheckUseCase, ReadyUseCase, LiveUseCase],
})
export class HealthModule {}
