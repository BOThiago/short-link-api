import { ApiProperty } from '@nestjs/swagger';
import { UrlListDto } from './url-list.dto';

export class PaginationMetaDto {
  @ApiProperty({
    description: 'Current page number',
    example: 1,
    type: 'integer',
    minimum: 1,
  })
  currentPage: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    type: 'integer',
    minimum: 1,
  })
  pageSize: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 5,
    type: 'integer',
    minimum: 0,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Total number of items',
    example: 42,
    type: 'integer',
    minimum: 0,
  })
  totalItems: number;

  @ApiProperty({
    description: 'Whether there is a next page',
    example: true,
  })
  hasNext: boolean;

  @ApiProperty({
    description: 'Whether there is a previous page',
    example: false,
  })
  hasPrevious: boolean;
}

export class PaginatedUrlListDto {
  @ApiProperty({
    description: 'List of URLs',
    type: [UrlListDto],
  })
  data: UrlListDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;
}
