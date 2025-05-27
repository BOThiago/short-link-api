import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlRepository } from './repositories/url.repository';
import { CreateUrlDto } from './dto';

describe('UrlService', () => {
  let service: UrlService;
  let urlRepository: jest.Mocked<UrlRepository>;
  let configService: jest.Mocked<ConfigService>;

  const mockUrl = {
    id: 1,
    shortCode: 'abc123',
    originalUrl: 'https://example.com',
    accessCount: 0,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
    creatorIp: '127.0.0.1',
  };

  beforeEach(async () => {
    const mockUrlRepository = {
      countByCreatorIp: jest.fn(),
      findByShortCodeIncludingExpired: jest.fn(),
      create: jest.fn(),
      findByShortCode: jest.fn(),
      findAllPaginated: jest.fn(),
      findAll: jest.fn(),
      incrementAccessCount: jest.fn(),
      createAccess: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: UrlRepository,
          useValue: mockUrlRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
    urlRepository = module.get(UrlRepository);
    configService = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createShortUrl', () => {
    const createUrlDto: CreateUrlDto = {
      originalUrl: 'https://example.com',
    };
    const clientIp = '127.0.0.1';

    beforeEach(() => {
      configService.get.mockImplementation(
        (key: string, defaultValue?: any) => {
          switch (key) {
            case 'RATE_LIMIT_LIMIT':
              return 10;
            case 'URL_EXPIRATION_MINUTES':
              return 60;
            default:
              return defaultValue;
          }
        },
      );
    });

    it('should create a short URL successfully', async () => {
      urlRepository.countByCreatorIp.mockResolvedValue(5);
      urlRepository.findByShortCodeIncludingExpired.mockResolvedValue(null);
      urlRepository.create.mockResolvedValue(mockUrl);

      const result = await service.createShortUrl(createUrlDto, clientIp);

      expect(result).toEqual({
        id: mockUrl.id,
        shortCode: mockUrl.shortCode,
        originalUrl: mockUrl.originalUrl,
        shortUrl: expect.any(String),
        expiresAt: mockUrl.expiresAt,
        accessCount: mockUrl.accessCount,
        createdAt: mockUrl.createdAt,
      });
      expect(urlRepository.countByCreatorIp).toHaveBeenCalledWith(
        clientIp,
        expect.any(Date),
      );
      expect(urlRepository.create).toHaveBeenCalledWith({
        shortCode: expect.any(String),
        originalUrl: createUrlDto.originalUrl,
        expiresAt: expect.any(Date),
        creatorIp: clientIp,
      });
    });

    it('should throw ForbiddenException when rate limit is exceeded', async () => {
      urlRepository.countByCreatorIp.mockResolvedValue(15); // Exceeds limit of 10

      await expect(
        service.createShortUrl(createUrlDto, clientIp),
      ).rejects.toThrow(ForbiddenException);
      expect(urlRepository.countByCreatorIp).toHaveBeenCalledWith(
        clientIp,
        expect.any(Date),
      );
    });

    it('should throw BadRequestException when unable to generate unique short code', async () => {
      urlRepository.countByCreatorIp.mockResolvedValue(5);
      urlRepository.findByShortCodeIncludingExpired.mockResolvedValue(mockUrl);

      await expect(
        service.createShortUrl(createUrlDto, clientIp),
      ).rejects.toThrow(BadRequestException);
      expect(
        urlRepository.findByShortCodeIncludingExpired,
      ).toHaveBeenCalledTimes(9);
    });

    it('should use custom expiration time from environment', async () => {
      const customExpirationMinutes = 120;
      configService.get.mockImplementation(
        (key: string, defaultValue?: any) => {
          if (key === 'URL_EXPIRATION_MINUTES') return customExpirationMinutes;
          if (key === 'RATE_LIMIT_LIMIT') return 10;
          return defaultValue;
        },
      );

      urlRepository.countByCreatorIp.mockResolvedValue(5);
      urlRepository.findByShortCodeIncludingExpired.mockResolvedValue(null);
      urlRepository.create.mockResolvedValue(mockUrl);

      await service.createShortUrl(createUrlDto, clientIp);

      expect(urlRepository.create).toHaveBeenCalledWith({
        shortCode: expect.any(String),
        originalUrl: createUrlDto.originalUrl,
        expiresAt: expect.any(Date),
        creatorIp: clientIp,
      });

      const createCall = urlRepository.create.mock.calls[0][0];
      const expectedExpirationTime = new Date(
        Date.now() + customExpirationMinutes * 60 * 1000,
      );
      const actualExpirationTime = createCall.expiresAt;

      expect(
        Math.abs(
          actualExpirationTime.getTime() - expectedExpirationTime.getTime(),
        ),
      ).toBeLessThan(1000);
    });

    it('should generate unique short codes', async () => {
      urlRepository.countByCreatorIp.mockResolvedValue(5);
      urlRepository.findByShortCodeIncludingExpired
        .mockResolvedValueOnce(mockUrl)
        .mockResolvedValueOnce(null);
      urlRepository.create.mockResolvedValue(mockUrl);

      await service.createShortUrl(createUrlDto, clientIp);

      expect(
        urlRepository.findByShortCodeIncludingExpired,
      ).toHaveBeenCalledTimes(2);
      expect(urlRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('accessUrl', () => {
    const shortCode = 'abc123';
    const userAgent = 'Mozilla/5.0';
    const ipAddress = '127.0.0.1';
    const referer = 'https://google.com';

    it('should access URL and track statistics', async () => {
      urlRepository.findByShortCode.mockResolvedValue(mockUrl);
      urlRepository.incrementAccessCount.mockResolvedValue(undefined);
      urlRepository.createAccess.mockResolvedValue({
        id: 1,
        urlId: mockUrl.id,
        accessedAt: new Date(),
        userAgent,
        ipAddress,
        referer,
      });

      const result = await service.accessUrl(
        shortCode,
        userAgent,
        ipAddress,
        referer,
      );

      expect(result).toBe(mockUrl.originalUrl);
      expect(urlRepository.findByShortCode).toHaveBeenCalledWith(shortCode);
      expect(urlRepository.incrementAccessCount).toHaveBeenCalledWith(
        mockUrl.id,
      );
      expect(urlRepository.createAccess).toHaveBeenCalledWith({
        urlId: mockUrl.id,
        userAgent,
        ipAddress,
        referer,
      });
    });

    it('should throw BadRequestException when URL not found', async () => {
      urlRepository.findByShortCode.mockResolvedValue(null);

      await expect(
        service.accessUrl(shortCode, userAgent, ipAddress, referer),
      ).rejects.toThrow(BadRequestException);
      expect(urlRepository.incrementAccessCount).not.toHaveBeenCalled();
      expect(urlRepository.createAccess).not.toHaveBeenCalled();
    });
  });
});
