import { Injectable } from '@nestjs/common';
import { register, Counter, Histogram, Gauge } from 'prom-client';
import { IncrementHttpRequestsInputDto } from '../../dto/input/incrementHttpRequests.dto';
import { ObserveHttpDurationInputDto } from '../../dto/input/observeHttpDuration.dto';
import { SetActiveConnectionsInputDto } from '../../dto/input/setActiveConnections.dto';

@Injectable()
export class MetricsUseCase {
  private readonly httpRequestsTotal: Counter<string>;
  private readonly httpRequestDuration: Histogram<string>;
  private readonly urlsCreatedTotal: Counter<string>;
  private readonly urlRedirectsTotal: Counter<string>;
  private readonly activeConnections: Gauge<string>;

  constructor() {
    this.httpRequestsTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status'],
      registers: [register],
    });

    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_ms',
      help: 'Duration of HTTP requests in milliseconds',
      labelNames: ['method', 'route'],
      buckets: [0.1, 5, 15, 50, 100, 500, 1000],
      registers: [register],
    });

    this.urlsCreatedTotal = new Counter({
      name: 'urls_created_total',
      help: 'Total number of URLs created',
      registers: [register],
    });

    this.urlRedirectsTotal = new Counter({
      name: 'url_redirects_total',
      help: 'Total number of URL redirects',
      registers: [register],
    });

    this.activeConnections = new Gauge({
      name: 'active_connections',
      help: 'Number of active connections',
      registers: [register],
    });
  }

  incrementHttpRequests({method, route, status}: IncrementHttpRequestsInputDto) {
    this.httpRequestsTotal.inc({
      method,
      route,
      status: status.toString(),
    });
  }

  observeHttpDuration({method, route, duration}: ObserveHttpDurationInputDto) {
    this.httpRequestDuration.observe({ method, route }, duration);
  }

  incrementUrlsCreated() {
    this.urlsCreatedTotal.inc();
  }

  incrementUrlRedirects() {
    this.urlRedirectsTotal.inc();
  }

  setActiveConnections({count}: SetActiveConnectionsInputDto) {
    this.activeConnections.set(count);
  }

  execute() {
    return register.metrics();
  }
} 