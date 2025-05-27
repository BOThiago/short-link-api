import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString } from 'class-validator';

export class LiveOutputDto {
  @ApiProperty({
    description: 'Application liveness status',
    example: 'alive',
    enum: ['alive', 'dead'],
  })
  @IsString({ message: 'Status must be a string' })
  status: 'alive' | 'dead';

  @ApiProperty({
    description: 'Timestamp when the liveness check was performed',
    example: '2024-01-15T10:30:00.000Z',
    format: 'date-time',
  })
  @IsDateString({}, { message: 'Timestamp must be a valid date string' })
  timestamp: Date;

  @ApiProperty({
    description: 'Additional liveness information',
    example: {
      process_id: 12345,
      memory_usage: '45.2 MB',
      cpu_usage: '12.5%',
    },
    required: false,
  })
  details?: {
    process_id?: number;
    memory_usage?: string;
    cpu_usage?: string;
    [key: string]: any;
  };
}
