import { IsOptional, IsNumberString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ReportsQueryDto {
  @ApiProperty({
    description: 'Number of days to include in the report',
    example: 30,
    required: false,
    minimum: 1,
    maximum: 365,
    default: 30,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1, { message: 'Days must be at least 1' })
  @Max(365, { message: 'Days cannot exceed 365' })
  days?: number = 30;
}

export class TopUrlsQueryDto {
  @ApiProperty({
    description: 'Number of top URLs to return',
    example: 10,
    required: false,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit?: number = 10;
}

export class StatsQueryDto extends ReportsQueryDto {
  @ApiProperty({
    description: 'Number of top URLs to include in the stats',
    example: 10,
    required: false,
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1, { message: 'Top limit must be at least 1' })
  @Max(50, { message: 'Top limit cannot exceed 50' })
  topLimit?: number = 10;
}
