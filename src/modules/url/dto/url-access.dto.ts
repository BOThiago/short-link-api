import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsDateString,
  IsString,
  IsOptional,
  IsIP,
} from 'class-validator';

export class UrlAccessDto {
  @ApiProperty({
    description: 'Unique identifier for the access record',
    example: 1,
    type: 'integer',
  })
  @IsNumber({}, { message: 'Access ID must be a number' })
  id: number;

  @ApiProperty({
    description: 'ID of the accessed URL',
    example: 123,
    type: 'integer',
  })
  @IsNumber({}, { message: 'URL ID must be a number' })
  urlId: number;

  @ApiProperty({
    description: 'Date and time when the URL was accessed',
    example: '2024-01-15T10:30:00.000Z',
    format: 'date-time',
  })
  @IsDateString({}, { message: 'Access date must be a valid date string' })
  accessedAt: Date;

  @ApiProperty({
    description: 'User agent string from the browser/client',
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    required: false,
    maxLength: 512,
  })
  @IsOptional()
  @IsString({ message: 'User agent must be a string' })
  userAgent?: string;

  @ApiProperty({
    description: 'IP address of the client',
    example: '192.168.1.1',
    required: false,
    format: 'ipv4',
  })
  @IsOptional()
  @IsString({ message: 'IP address must be a string' })
  ipAddress?: string;

  @ApiProperty({
    description: 'Referer URL (page that linked to the short URL)',
    example: 'https://example.com/page',
    required: false,
    format: 'url',
    maxLength: 2048,
  })
  @IsOptional()
  @IsString({ message: 'Referer must be a string' })
  referer?: string;
}
