import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsNumber, Min } from 'class-validator';

export class CheckOutputDto {
  @ApiProperty({
    description: 'Application health status',
    example: 'OK',
    enum: ['OK', 'ERROR'],
  })
  @IsString({ message: 'Status must be a string' })
  status: 'OK' | 'ERROR';

  @ApiProperty({
    description: 'Timestamp when the health check was performed',
    example: '2024-01-15T10:30:00.000Z',
    format: 'date-time',
  })
  @IsDateString({}, { message: 'Timestamp must be a valid date string' })
  timestamp: Date;

  @ApiProperty({
    description: 'Application uptime in seconds',
    example: 3600,
    type: 'number',
    minimum: 0,
  })
  @IsNumber({}, { message: 'Uptime must be a number' })
  @Min(0, { message: 'Uptime cannot be negative' })
  uptime: number;

  @ApiProperty({
    description: 'Additional health information',
    example: {
      version: '1.0.0',
      environment: 'production',
      database: 'connected',
      redis: 'connected',
    },
    required: false,
  })
  details?: {
    version?: string;
    environment?: string;
    database?: string;
    redis?: string;
    [key: string]: any;
  };
}
