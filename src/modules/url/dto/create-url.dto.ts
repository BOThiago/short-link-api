import {
  IsUrl,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUrlDto {
  @ApiProperty({
    description: 'The original URL to be shortened',
    example: 'https://www.example.com/very-long-url-that-needs-to-be-shortened',
    format: 'url',
    maxLength: 2048,
    minLength: 1,
  })
  @IsUrl({}, { message: 'Please provide a valid URL' })
  @IsNotEmpty({ message: 'URL cannot be empty' })
  @IsString({ message: 'URL must be a string' })
  @MaxLength(2048, { message: 'URL must be shorter than 2048 characters' })
  @MinLength(1, { message: 'URL cannot be empty' })
  originalUrl: string;

  @ApiProperty({
    description: 'Custom short code for the URL (optional)',
    example: 'my-custom-code',
    required: false,
    maxLength: 50,
    minLength: 3,
    pattern: '^[a-zA-Z0-9-_]+$',
  })
  @IsOptional()
  @IsString({ message: 'Custom code must be a string' })
  @MinLength(3, { message: 'Custom code must be at least 3 characters long' })
  @MaxLength(50, { message: 'Custom code must be shorter than 50 characters' })
  customCode?: string;

  @ApiProperty({
    description: 'Expiration date for the URL (optional, ISO 8601 format)',
    example: '2024-12-31T23:59:59.000Z',
    required: false,
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'Expiration date must be a valid ISO 8601 date string' },
  )
  expiresAt?: string;
}
