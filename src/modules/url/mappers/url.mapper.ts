import { Url, UrlAccess } from '../entities';
import { CreateUrlResponseDto, UrlListDto, UrlAccessDto } from '../dto/index';

export class UrlMapper {
  static toCreateResponseDto(url: Url): CreateUrlResponseDto {
    return {
      id: url.id,
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      shortUrl: `${process.env.BASE_URL || 'http://localhost:3000'}/api/r/${url.shortCode}`,
      expiresAt: url.expiresAt,
      accessCount: url.accessCount,
      createdAt: url.createdAt,
    };
  }

  static toListDto(url: Url): UrlListDto {
    return {
      id: url.id,
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      shortUrl: `${process.env.BASE_URL || 'http://localhost:3000'}/api/r/${url.shortCode}`,
      expiresAt: url.expiresAt,
      accessCount: url.accessCount,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
    };
  }

  static toAccessDto(access: UrlAccess): UrlAccessDto {
    return {
      id: access.id,
      urlId: access.urlId,
      accessedAt: access.accessedAt,
      userAgent: access.userAgent,
      ipAddress: access.ipAddress,
      referer: access.referer,
    };
  }
}
