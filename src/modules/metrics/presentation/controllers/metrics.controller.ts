import { Controller, Get, Header } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiProduces,
} from '@nestjs/swagger';
import { MetricsUseCase } from '../../application/use-cases/metrics.use-case';

@ApiTags('Metrics')
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsUseCase) {}

  @Get()
  @Header('Content-Type', 'text/plain')
  @ApiOperation({
    summary: 'Get application metrics',
    description:
      'Returns Prometheus-formatted metrics for monitoring and observability. Includes custom application metrics and standard Node.js metrics.',
  })
  @ApiProduces('text/plain')
  @ApiOkResponse({
    description: 'Prometheus-formatted metrics data',
    content: {
      'text/plain': {
        schema: {
          type: 'string',
          example: `# HELP nodejs_version_info Node.js version info
# TYPE nodejs_version_info gauge
nodejs_version_info{version="v18.17.0",major="18",minor="17",patch="0"} 1

# HELP short_link_urls_total Total number of URLs created
# TYPE short_link_urls_total counter
short_link_urls_total 150

# HELP short_link_accesses_total Total number of URL accesses
# TYPE short_link_accesses_total counter
short_link_accesses_total 2847`,
        },
      },
    },
  })
  async getMetrics(): Promise<string> {
    return this.metricsService.execute();
  }
}
