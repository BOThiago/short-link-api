import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsPositive, Min } from 'class-validator';

export class UrlStatsDto {
  @ApiProperty({
    description: 'Date in YYYY-MM-DD format',
    example: '2024-01-15',
    format: 'date',
  })
  @IsDateString({}, { message: 'Date must be in YYYY-MM-DD format' })
  date: string;

  @ApiProperty({
    description: 'Number of accesses on this date',
    example: 42,
    type: 'integer',
    minimum: 0,
  })
  @IsNumber({}, { message: 'Access count must be a number' })
  @Min(0, { message: 'Access count cannot be negative' })
  accessCount: number;
}

export class UrlInfoDto {
  @ApiProperty({
    description: 'Unique identifier for the URL',
    example: 1,
    type: 'integer',
  })
  @IsNumber({}, { message: 'ID must be a number' })
  @IsPositive({ message: 'ID must be positive' })
  id: number;

  @ApiProperty({
    description: 'Short code for the URL',
    example: 'abc123',
    maxLength: 50,
  })
  shortCode: string;

  @ApiProperty({
    description: 'Original URL',
    example: 'https://www.example.com',
    format: 'url',
    maxLength: 2048,
  })
  originalUrl: string;

  @ApiProperty({
    description: 'Total number of accesses for this URL',
    example: 156,
    type: 'integer',
    minimum: 0,
  })
  @IsNumber({}, { message: 'Access count must be a number' })
  @Min(0, { message: 'Access count cannot be negative' })
  accessCount: number;

  @ApiProperty({
    description: 'Date when the URL was created',
    example: '2024-01-15T10:30:00.000Z',
    format: 'date-time',
  })
  createdAt: Date;
}

export class TopUrlStatsDto {
  @ApiProperty({
    description: 'URL information',
    type: UrlInfoDto,
  })
  url: UrlInfoDto;

  @ApiProperty({
    description: 'Total number of accesses for this URL',
    example: 156,
    type: 'integer',
    minimum: 0,
  })
  @IsNumber({}, { message: 'Total accesses must be a number' })
  @Min(0, { message: 'Total accesses cannot be negative' })
  totalAccesses: number;
}

export class ReportStatsDto {
  @ApiProperty({
    description: 'Daily access statistics for the specified period',
    type: [UrlStatsDto],
    example: [
      { date: '2024-01-15', accessCount: 42 },
      { date: '2024-01-14', accessCount: 35 },
    ],
  })
  dailyStats: UrlStatsDto[];

  @ApiProperty({
    description: 'Top accessed URLs in the specified period',
    type: [TopUrlStatsDto],
  })
  topUrls: TopUrlStatsDto[];

  @ApiProperty({
    description: 'Summary statistics for the report period',
    example: {
      totalUrls: 150,
      totalAccesses: 2847,
      averageAccessesPerDay: 94.9,
      mostActiveDay: '2024-01-15',
    },
  })
  summary: {
    totalUrls: number;
    totalAccesses: number;
    averageAccessesPerDay: number;
    mostActiveDay: string | null;
  };
}
