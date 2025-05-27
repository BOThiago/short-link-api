import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MetricsUseCase } from '../../application/use-cases/metrics.use-case';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  constructor(private readonly metricsService: MetricsUseCase) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const method = req.method;
    const route = req.route?.path || req.path;

    res.on('finish', () => {
      const duration = Date.now() - start;
      const status = res.statusCode;

      this.metricsService.incrementHttpRequests({ method, route, status });
      this.metricsService.observeHttpDuration({ method, route, duration });
    });

    next();
  }
} 