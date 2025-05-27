import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
    type: 'integer',
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Validation failed',
  })
  message: string;

  @ApiProperty({
    description: 'Error type or code',
    example: 'BAD_REQUEST',
  })
  error: string;

  @ApiProperty({
    description: 'Timestamp when the error occurred',
    example: '2024-01-15T10:30:00.000Z',
    format: 'date-time',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Request path where the error occurred',
    example: '/api/url',
  })
  path: string;
}

export class ValidationErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({
    description: 'Detailed validation errors',
    example: [
      'originalUrl must be a valid URL',
      'customCode must be at least 3 characters long',
    ],
    type: [String],
  })
  details: string[];
}

export class NotFoundErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({
    description: 'Error message',
    example: 'URL not found or expired',
  })
  message: string;

  @ApiProperty({
    description: 'Error type',
    example: 'NOT_FOUND',
  })
  error: string;
}

export class RateLimitErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({
    description: 'Error message',
    example: 'Rate limit exceeded',
  })
  message: string;

  @ApiProperty({
    description: 'Error type',
    example: 'TOO_MANY_REQUESTS',
  })
  error: string;

  @ApiProperty({
    description: 'Seconds until rate limit resets',
    example: 60,
    type: 'integer',
  })
  retryAfter: number;
}
