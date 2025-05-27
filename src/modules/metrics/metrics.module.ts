import { Module } from "@nestjs/common";
import { MetricsUseCase } from "./application/use-cases/metrics.use-case";
import { MetricsController } from "./presentation/controllers/metrics.controller";

@Module({
    controllers: [MetricsController],
    providers: [MetricsUseCase],
    exports: [MetricsUseCase],
})
export class MetricsModule {}