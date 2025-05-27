import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Ip,
  Query,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBadRequestResponse,
  ApiTooManyRequestsResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { UrlService } from '../../url.service';
import {
  CreateUrlDto,
  CreateUrlResponseDto,
  UrlListDto,
  UrlQueryDto,
  PaginatedUrlListDto,
  ValidationErrorResponseDto,
  RateLimitErrorResponseDto,
} from '../../dto';

@ApiTags('URLs')
@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  @UseGuards(ThrottlerGuard)
  @ApiOperation({
    summary: 'Create a short URL',
    description:
      'Creates a shortened version of the provided URL. Optionally accepts a custom short code and expiration date.',
  })
  @ApiCreatedResponse({
    description: 'URL successfully shortened',
    type: CreateUrlResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    type: ValidationErrorResponseDto,
  })
  @ApiTooManyRequestsResponse({
    description: 'Rate limit exceeded',
    type: RateLimitErrorResponseDto,
  })
  async createShortUrl(
    @Body() createUrlDto: CreateUrlDto,
    @Ip() clientIp: string,
  ): Promise<CreateUrlResponseDto> {
    return this.urlService.createShortUrl(createUrlDto, clientIp);
  }

  @Get()
  @ApiOperation({
    summary: 'Get URLs with pagination and filtering',
    description:
      'Retrieves a paginated list of URLs with optional search, sorting, and filtering capabilities.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default: 1)',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page (default: 10, max: 100)',
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Field to sort by',
    enum: ['createdAt', 'updatedAt', 'accessCount', 'expiresAt'],
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order',
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term to filter URLs',
    type: String,
    example: 'example.com',
  })
  @ApiOkResponse({
    description: 'Paginated list of URLs',
    type: PaginatedUrlListDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid query parameters',
    type: ValidationErrorResponseDto,
  })
  async findAll(@Query() query: UrlQueryDto): Promise<PaginatedUrlListDto> {
    return this.urlService.findAllPaginated(query);
  }

  @Get('simple')
  @ApiOperation({
    summary: 'Get all URLs (simple list)',
    description:
      'Retrieves a simple list of all URLs without pagination. Use with caution on large datasets.',
  })
  @ApiOkResponse({
    description: 'Simple list of all URLs',
    type: [UrlListDto],
  })
  async findAllSimple(): Promise<UrlListDto[]> {
    return this.urlService.findAll();
  }
}
