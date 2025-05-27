import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UrlRepository } from './repositories/url.repository';
import { UrlMapper } from './mappers/url.mapper';
import {
  CreateUrlDto,
  CreateUrlResponseDto,
  PaginatedUrlListDto,
  UrlListDto,
  UrlQueryDto,
} from './dto';
import { Url } from './entities';
import { nanoid } from 'nanoid';

@Injectable()
export class UrlService {
  constructor(
    private readonly urlRepository: UrlRepository,
    private readonly configService: ConfigService,
  ) {}

  async createShortUrl(
    createUrlDto: CreateUrlDto,
    clientIp: string,
  ): Promise<CreateUrlResponseDto> {
    const rateLimitWindow = new Date(Date.now() - 60 * 60 * 1000); // 1 hora atrás
    const recentUrls = await this.urlRepository.countByCreatorIp(
      clientIp,
      rateLimitWindow,
    );
    const maxUrls = this.configService.get<number>('RATE_LIMIT_LIMIT', 10);

    if (recentUrls >= maxUrls) {
      throw new ForbiddenException(
        'Rate limit exceeded. Too many URLs created from this IP.',
      );
    }

    const expirationMinutes = this.configService.get<number>(
      'URL_EXPIRATION_MINUTES',
      60,
    );
    const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);

    let shortCode: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      shortCode = nanoid(8);
      attempts++;

      if (attempts >= maxAttempts) {
        throw new BadRequestException(
          'Unable to generate unique short code. Please try again.',
        );
      }
    } while (
      await this.urlRepository.findByShortCodeIncludingExpired(shortCode)
    );

    const url = await this.urlRepository.create({
      shortCode,
      originalUrl: createUrlDto.originalUrl,
      expiresAt,
      creatorIp: clientIp,
    });

    return UrlMapper.toCreateResponseDto(url);
  }

  async findByShortCode(shortCode: string): Promise<Url | null> {
    return this.urlRepository.findByShortCode(shortCode);
  }

  async findAllPaginated(query: UrlQueryDto): Promise<PaginatedUrlListDto> {
    const { page = 1, limit = 10, search } = query;
    const [urls, total] = await this.urlRepository.findAllPaginated(
      page,
      limit,
    );

    const items = urls.map((url) => UrlMapper.toListDto(url));

    return {
      data: items,
      meta: {
        totalItems: total,
        currentPage: page,
        hasNext: page < Math.ceil(total / limit),
        hasPrevious: page > 1,
        pageSize: limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async accessUrl(
    shortCode: string,
    userAgent?: string,
    ipAddress?: string,
    referer?: string,
  ): Promise<string> {
    const url = await this.findByShortCode(shortCode);

    if (!url) {
      throw new BadRequestException('URL not found or expired');
    }

    await Promise.all([
      this.urlRepository.incrementAccessCount(url.id),
      this.urlRepository.createAccess({
        urlId: url.id,
        userAgent,
        ipAddress,
        referer,
      }),
    ]);

    return url.originalUrl;
  }

  async findAll(): Promise<UrlListDto[]> {
    const urls = await this.urlRepository.findAll();
    return urls.map((url) => UrlMapper.toListDto(url));
  }
}
