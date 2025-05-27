import { Injectable } from '@nestjs/common';
import { Counter } from 'prom-client';

@Injectable()
export class IncrementHttpRequestUseCase {
  private readonly httpRequestsTotal: Counter<string>;

  execute(method: string, route: string, status: number) {
    this.httpRequestsTotal.inc({
      method,
      route,
      status: status.toString(),
    });
  }
}
