import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, Min } from 'class-validator';

export class PeakAccessDto {
  @ApiProperty({
    description: 'Date with the highest number of accesses',
    example: '2024-01-15',
    format: 'date',
  })
  @IsDateString({}, { message: 'Date must be in YYYY-MM-DD format' })
  date: string;

  @ApiProperty({
    description: 'Number of accesses on the peak day',
    example: 247,
    type: 'integer',
    minimum: 0,
  })
  @IsNumber({}, { message: 'Access count must be a number' })
  @Min(0, { message: 'Access count cannot be negative' })
  accessCount: number;

  @ApiProperty({
    description: 'Percentage increase compared to average daily accesses',
    example: 156.7,
    type: 'number',
    format: 'float',
  })
  @IsNumber({}, { message: 'Percentage must be a number' })
  percentageAboveAverage: number;
}
