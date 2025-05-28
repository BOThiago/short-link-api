import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { UrlModule } from '../src/modules/url/url.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { UrlRepository } from '../src/modules/url/repositories/url.repository';

describe('URL Controller (e2e)', () => {
  let app: INestApplication<App>;
  let urlRepository: jest.Mocked<UrlRepository>;

  const mockUrl = {
    id: 1,
    shortCode: 'abc12345',
    originalUrl:
      'https://www.example.com/very-long-url-that-needs-to-be-shortened',
    accessCount: 0,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
    creatorIp: '127.0.0.1',
  };

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

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ['.env.test', '.env'],
        }),
        ThrottlerModule.forRoot([
          {
            ttl: 60000,
            limit: 100, // Higher limit for tests
          },
        ]),
        UrlModule,
      ],
    })
      .overrideProvider(UrlRepository)
      .useValue(mockUrlRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    urlRepository = moduleFixture.get(UrlRepository);

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    urlRepository.countByCreatorIp.mockResolvedValue(5);
    urlRepository.findByShortCodeIncludingExpired.mockResolvedValue(null);
    urlRepository.create.mockResolvedValue(mockUrl);
    urlRepository.findByShortCode.mockResolvedValue(mockUrl);
    urlRepository.findAllPaginated.mockResolvedValue([[mockUrl], 1]);
    urlRepository.findAll.mockResolvedValue([mockUrl]);
    urlRepository.incrementAccessCount.mockResolvedValue(undefined);
    urlRepository.createAccess.mockResolvedValue({
      id: 1,
      urlId: mockUrl.id,
      accessedAt: new Date(),
      userAgent: 'test-agent',
      ipAddress: '127.0.0.1',
      referer: 'test-referer',
    });
  });

  describe('/url (POST)', () => {
    it('should create a short URL successfully', async () => {
      const createUrlDto = {
        originalUrl:
          'https://www.example.com/very-long-url-that-needs-to-be-shortened',
      };

      const response = await request(app.getHttpServer())
        .post('/url')
        .send(createUrlDto)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(Number),
        shortCode: expect.any(String),
        originalUrl: createUrlDto.originalUrl,
        shortUrl: expect.stringMatching(/^[^\/]+\/[a-zA-Z0-9_-]+$/),
        expiresAt: expect.any(String),
        accessCount: expect.any(Number),
        createdAt: expect.any(String),
      });

      expect(response.body.shortCode).toHaveLength(8);

      expect(urlRepository.countByCreatorIp).toHaveBeenCalled();
      expect(urlRepository.create).toHaveBeenCalled();
    });

    it('should reject invalid URLs', async () => {
      const invalidUrlDto = {
        originalUrl: 'not-a-valid-url',
      };

      const response = await request(app.getHttpServer())
        .post('/url')
        .send(invalidUrlDto)
        .expect(400);

      expect(response.body).toMatchObject({
        statusCode: 400,
        message: expect.arrayContaining([
          expect.stringContaining('Please provide a valid URL'),
        ]),
        error: 'Bad Request',
      });
    });

    it('should reject empty URL', async () => {
      const emptyUrlDto = {
        originalUrl: '',
      };

      const response = await request(app.getHttpServer())
        .post('/url')
        .send(emptyUrlDto)
        .expect(400);

      expect(response.body).toMatchObject({
        statusCode: 400,
        message: expect.arrayContaining([
          expect.stringContaining('URL cannot be empty'),
        ]),
        error: 'Bad Request',
      });
    });

    it('should reject URLs that are too long', async () => {
      const longUrlDto = {
        originalUrl: 'https://example.com/' + 'a'.repeat(2050), // Exceeds 2048 char limit
      };

      const response = await request(app.getHttpServer())
        .post('/url')
        .send(longUrlDto)
        .expect(400);

      expect(response.body).toMatchObject({
        statusCode: 400,
        message: expect.arrayContaining([
          expect.stringContaining('URL must be shorter than 2048 characters'),
        ]),
        error: 'Bad Request',
      });
    });

    it('should reject requests with extra fields', async () => {
      const invalidDto = {
        originalUrl: 'https://example.com',
        extraField: 'should not be allowed',
      };

      const response = await request(app.getHttpServer())
        .post('/url')
        .send(invalidDto)
        .expect(400);

      expect(response.body).toMatchObject({
        statusCode: 400,
        message: expect.arrayContaining([
          expect.stringContaining('property extraField should not exist'),
        ]),
        error: 'Bad Request',
      });
    });

    it('should handle rate limiting', async () => {
      urlRepository.countByCreatorIp.mockResolvedValue(150);

      const createUrlDto = {
        originalUrl: 'https://example.com/rate-limit-test',
      };

      const response = await request(app.getHttpServer())
        .post('/url')
        .send(createUrlDto)
        .expect(403);

      expect(response.body).toMatchObject({
        statusCode: 403,
        message: expect.stringContaining('Rate limit exceeded'),
      });
    });

    it('should create different short codes for the same URL', async () => {
      const createUrlDto = {
        originalUrl: 'https://example.com/duplicate-test',
      };

      urlRepository.create
        .mockResolvedValueOnce({ ...mockUrl, shortCode: 'abc12345' })
        .mockResolvedValueOnce({ ...mockUrl, shortCode: 'def67890' });

      const response1 = await request(app.getHttpServer())
        .post('/url')
        .send(createUrlDto)
        .expect(201);

      const response2 = await request(app.getHttpServer())
        .post('/url')
        .send(createUrlDto)
        .expect(201);

      expect(response1.body.shortCode).not.toBe(response2.body.shortCode);
      expect(response1.body.originalUrl).toBe(response2.body.originalUrl);
    });
  });

  describe('/url (GET)', () => {
    it('should return paginated list of URLs', async () => {
      const response = await request(app.getHttpServer())
        .get('/url')
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body).toMatchObject({
        data: expect.any(Array),
        meta: {
          totalItems: expect.any(Number),
          currentPage: 1,
          hasNext: expect.any(Boolean),
          hasPrevious: false,
          pageSize: 10,
          totalPages: expect.any(Number),
        },
      });

      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0]).toMatchObject({
        id: expect.any(Number),
        shortCode: expect.any(String),
        originalUrl: expect.any(String),
        shortUrl: expect.any(String),
        accessCount: expect.any(Number),
        expiresAt: expect.any(String),
        createdAt: expect.any(String),
      });
    });

    it('should handle pagination correctly', async () => {
      urlRepository.findAllPaginated.mockResolvedValue([[mockUrl], 1]);

      const response = await request(app.getHttpServer())
        .get('/url')
        .query({ page: 1, limit: 2 })
        .expect(200);

      expect(response.body.meta.pageSize).toBe(2);
      expect(response.body.data.length).toBeLessThanOrEqual(2);
    });

    it('should validate pagination parameters', async () => {
      const response = await request(app.getHttpServer())
        .get('/url')
        .query({ page: 0, limit: -1 })
        .expect(400);

      expect(response.body).toMatchObject({
        statusCode: 400,
        error: 'Bad Request',
      });
    });
  });

  describe('URL Redirection', () => {
    it('should redirect to original URL', async () => {
      const response = await request(app.getHttpServer())
        .get('/abc12345')
        .expect(302);

      expect(response.headers.location).toBe(mockUrl.originalUrl);
      expect(urlRepository.findByShortCode).toHaveBeenCalledWith('abc12345');
      expect(urlRepository.incrementAccessCount).toHaveBeenCalledWith(
        mockUrl.id,
      );
      expect(urlRepository.createAccess).toHaveBeenCalled();
    });

    it('should return 404 for non-existent short code', async () => {
      urlRepository.findByShortCode.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .get('/nonexistent')
        .expect(404);

      expect(response.body).toMatchObject({
        statusCode: 404,
        error: 'NOT_FOUND',
        message: expect.stringContaining('URL not found'),
      });
    });

    it('should track access statistics', async () => {
      await request(app.getHttpServer()).get('/abc12345').expect(302);

      expect(urlRepository.incrementAccessCount).toHaveBeenCalledWith(
        mockUrl.id,
      );
      expect(urlRepository.createAccess).toHaveBeenCalledWith({
        urlId: mockUrl.id,
        userAgent: expect.any(String),
        ipAddress: expect.any(String),
        referer: undefined,
      });
    });
  });
});
