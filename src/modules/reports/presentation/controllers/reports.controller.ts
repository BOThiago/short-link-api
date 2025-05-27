import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBadRequestResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ReportsService } from '../../application/reports.service';
import {
  ReportStatsDto,
  UrlStatsDto,
  TopUrlStatsDto,
  PeakAccessDto,
  ReportsQueryDto,
  TopUrlsQueryDto,
  StatsQueryDto,
} from '../../dto';
import { ValidationErrorResponseDto } from '../../../url/dto';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('stats')
  @ApiOperation({
    summary: 'Get comprehensive URL statistics',
    description:
      'Retrieves comprehensive statistics including daily access data, top URLs, and summary metrics for a specified time period.',
  })
  @ApiQuery({
    name: 'days',
    required: false,
    description: 'Number of days to include in statistics (1-365)',
    type: Number,
    example: 30,
    schema: { minimum: 1, maximum: 365, default: 30 },
  })
  @ApiQuery({
    name: 'topLimit',
    required: false,
    description: 'Number of top URLs to include (1-50)',
    type: Number,
    example: 10,
    schema: { minimum: 1, maximum: 50, default: 10 },
  })
  @ApiOkResponse({
    description:
      'Comprehensive URL statistics including daily stats, top URLs, and summary',
    type: ReportStatsDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid query parameters',
    type: ValidationErrorResponseDto,
  })
  async getStats(@Query() query: StatsQueryDto): Promise<ReportStatsDto> {
    const days = query.days || 30;
    const topLimit = query.topLimit || 10;
    return this.reportsService.getReportStats(days, topLimit);
  }

  @Get('daily')
  @ApiOperation({
    summary: 'Get daily access statistics',
    description:
      'Retrieves daily access statistics showing the number of URL accesses per day for a specified time period.',
  })
  @ApiQuery({
    name: 'days',
    required: false,
    description: 'Number of days to include (1-365)',
    type: Number,
    example: 30,
    schema: { minimum: 1, maximum: 365, default: 30 },
  })
  @ApiOkResponse({
    description: 'Daily access statistics for the specified period',
    type: [UrlStatsDto],
  })
  @ApiBadRequestResponse({
    description: 'Invalid query parameters',
    type: ValidationErrorResponseDto,
  })
  async getDailyStats(@Query() query: ReportsQueryDto): Promise<UrlStatsDto[]> {
    const days = query.days || 30;
    return this.reportsService.getDailyStats(days);
  }

  @Get('top-urls')
  @ApiOperation({
    summary: 'Get top accessed URLs',
    description:
      'Retrieves the most accessed URLs, ranked by total number of accesses. Useful for identifying popular content.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of top URLs to return (1-100)',
    type: Number,
    example: 10,
    schema: { minimum: 1, maximum: 100, default: 10 },
  })
  @ApiOkResponse({
    description: 'List of top accessed URLs with access counts',
    type: [TopUrlStatsDto],
  })
  @ApiBadRequestResponse({
    description: 'Invalid query parameters',
    type: ValidationErrorResponseDto,
  })
  async getTopUrls(@Query() query: TopUrlsQueryDto): Promise<TopUrlStatsDto[]> {
    const limit = query.limit || 10;
    return this.reportsService.getTopUrls(limit);
  }

  @Get('peak-access')
  @ApiOperation({
    summary: 'Get peak access period',
    description:
      'Identifies the date with the highest number of URL accesses, including comparison metrics with average daily usage.',
  })
  @ApiOkResponse({
    description: 'Peak access day with statistics and comparison metrics',
    type: PeakAccessDto,
  })
  async getPeakAccess(): Promise<PeakAccessDto | null> {
    return this.reportsService.getPeakAccessPeriod();
  }
}
