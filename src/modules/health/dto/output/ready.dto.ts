import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean } from 'class-validator';

export class ReadyOutputDto {
  @ApiProperty({
    description: 'Application readiness status',
    example: 'ready',
    enum: ['ready', 'not_ready'],
  })
  @IsString({ message: 'Status must be a string' })
  status: 'ready' | 'not_ready';

  @ApiProperty({
    description: 'Whether all dependencies are ready',
    example: true,
  })
  @IsBoolean({ message: 'Ready must be a boolean' })
  ready: boolean;

  @ApiProperty({
    description: 'Dependency readiness details',
    example: {
      database: true,
      redis: true,
      external_api: false,
    },
    required: false,
  })
  dependencies?: {
    database?: boolean;
    redis?: boolean;
    external_api?: boolean;
    [key: string]: boolean;
  };
}
