import {
  CreateUrlResponseDto,
  UrlListDto,
  PaginatedUrlListDto,
  PaginationMetaDto,
} from '../dto';

export interface UrlEntity {
  id: number;
  shortCode: string;
  originalUrl: string;
  expiresAt: Date;
  accessCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationData {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

export class UrlPresenter {
  static toCreateUrlResponse(
    url: UrlEntity,
    baseUrl: string,
  ): CreateUrlResponseDto {
    return {
      id: url.id,
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      shortUrl: `${baseUrl}/r/${url.shortCode}`,
      expiresAt: url.expiresAt,
      accessCount: url.accessCount,
      createdAt: url.createdAt,
    };
  }

  static toUrlListItem(url: UrlEntity, baseUrl: string): UrlListDto {
    return {
      id: url.id,
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      shortUrl: `${baseUrl}/r/${url.shortCode}`,
      expiresAt: url.expiresAt,
      accessCount: url.accessCount,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
    };
  }

  static toUrlList(urls: UrlEntity[], baseUrl: string): UrlListDto[] {
    return urls.map((url) => this.toUrlListItem(url, baseUrl));
  }

  static toPaginatedUrlList(
    urls: UrlEntity[],
    pagination: PaginationData,
    baseUrl: string,
  ): PaginatedUrlListDto {
    const data = this.toUrlList(urls, baseUrl);

    const meta: PaginationMetaDto = {
      currentPage: pagination.currentPage,
      pageSize: pagination.pageSize,
      totalPages: pagination.totalPages,
      totalItems: pagination.totalItems,
      hasNext: pagination.currentPage < pagination.totalPages,
      hasPrevious: pagination.currentPage > 1,
    };

    return {
      data,
      meta,
    };
  }

  static formatShortUrl(shortCode: string, baseUrl: string): string {
    return `${baseUrl}/r/${shortCode}`;
  }
}
