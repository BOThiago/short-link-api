import { ApiProperty } from '@nestjs/swagger';

export class CreateUrlResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the URL',
    example: 1,
    type: 'integer',
    format: 'int64',
  })
  id: number;

  @ApiProperty({
    description: 'Short code for the URL',
    example: 'abc123',
    maxLength: 50,
    minLength: 1,
  })
  shortCode: string;

  @ApiProperty({
    description: 'Original URL that was shortened',
    example: 'https://www.example.com/very-long-url-that-needs-to-be-shortened',
    format: 'url',
    maxLength: 2048,
  })
  originalUrl: string;

  @ApiProperty({
    description: 'Complete shortened URL ready to use',
    example: 'http://localhost:3000/r/abc123',
    format: 'url',
  })
  shortUrl: string;

  @ApiProperty({
    description: 'URL expiration date and time',
    example: '2024-12-31T23:59:59.000Z',
    format: 'date-time',
    type: 'string',
  })
  expiresAt: Date;

  @ApiProperty({
    description: 'Number of times the URL has been accessed',
    example: 0,
    type: 'integer',
    minimum: 0,
  })
  accessCount: number;

  @ApiProperty({
    description: 'Date and time when the URL was created',
    example: '2024-01-15T10:30:00.000Z',
    format: 'date-time',
    type: 'string',
  })
  createdAt: Date;
}
