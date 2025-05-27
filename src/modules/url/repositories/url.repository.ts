import { Injectable, Inject } from '@nestjs/common';
import { eq, and, gt, sql, desc, count, gte, lt, like, or } from 'drizzle-orm';
import { Database } from '../../../shared/database';
import { DATABASE_TOKEN } from '../../../shared/database/database.module';
import {
  urls,
  urlAccesses,
  Url,
  InsertUrl,
  UrlAccess,
  InsertUrlAccess,
} from '../entities';

export interface UrlStats {
  date: string;
  accessCount: number;
}

export interface TopUrlStats {
  url: Url;
  totalAccesses: number;
}

@Injectable()
export class UrlRepository {
  constructor(@Inject(DATABASE_TOKEN) private readonly db: Database) {}

  async create(data: InsertUrl): Promise<Url> {
    const [insertResult] = await this.db.insert(urls).values(data);
    return this.findByShortCode(data.shortCode);
  }

  async findByShortCode(shortCode: string): Promise<Url | null> {
    const [url] = await this.db
      .select()
      .from(urls)
      .where(and(eq(urls.shortCode, shortCode), gt(urls.expiresAt, new Date())))
      .limit(1);

    return url || null;
  }

  async findByShortCodeIncludingExpired(
    shortCode: string,
  ): Promise<Url | null> {
    const [url] = await this.db
      .select()
      .from(urls)
      .where(eq(urls.shortCode, shortCode))
      .limit(1);

    return url || null;
  }

  async findById(id: number): Promise<Url | null> {
    const [url] = await this.db
      .select()
      .from(urls)
      .where(eq(urls.id, id))
      .limit(1);

    return url || null;
  }

  async findAll(): Promise<Url[]> {
    return this.db.select().from(urls).orderBy(desc(urls.createdAt));
  }

  async findAllPaginated(
    page: number,
    limit: number,
    search?: string,
  ): Promise<[Url[], number]> {
    const offset = (page - 1) * limit;

    const query = this.db
      .select()
      .from(urls)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(urls.createdAt));

    if (search) {
      query.where(
        or(
          like(urls.originalUrl, `%${search}%`),
          like(urls.shortCode, `%${search}%`),
        ),
      );
    }

    const [urlResults, countResults] = await Promise.all([
      query,
      this.db
        .select({ count: sql<number>`count(*)` })
        .from(urls)
        .where(
          search
            ? or(
                like(urls.originalUrl, `%${search}%`),
                like(urls.shortCode, `%${search}%`),
              )
            : undefined,
        ),
    ]);

    return [urlResults, Number(countResults[0].count)];
  }

  async incrementAccessCount(id: number): Promise<void> {
    await this.db
      .update(urls)
      .set({ accessCount: sql`${urls.accessCount} + 1` })
      .where(eq(urls.id, id));
  }

  async createAccess(data: InsertUrlAccess): Promise<UrlAccess> {
    const [insertResult] = await this.db.insert(urlAccesses).values(data);
    const [access] = await this.db
      .select()
      .from(urlAccesses)
      .where(eq(urlAccesses.id, insertResult.insertId))
      .limit(1);

    return access;
  }

  async getUrlStatsByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<UrlStats[]> {
    const result = await this.db
      .select({
        date: sql<string>`DATE(${urlAccesses.accessedAt})`,
        accessCount: count(urlAccesses.id),
      })
      .from(urlAccesses)
      .where(
        and(
          gte(urlAccesses.accessedAt, startDate),
          lt(urlAccesses.accessedAt, endDate),
        ),
      )
      .groupBy(sql`DATE(${urlAccesses.accessedAt})`)
      .orderBy(sql`DATE(${urlAccesses.accessedAt})`);

    return result.map((row) => ({
      date: row.date,
      accessCount: Number(row.accessCount),
    }));
  }

  async getTopUrlsByAccesses(limit: number = 10): Promise<TopUrlStats[]> {
    const result = await this.db
      .select({
        url: urls,
        totalAccesses: count(urlAccesses.id),
      })
      .from(urls)
      .leftJoin(urlAccesses, eq(urls.id, urlAccesses.urlId))
      .groupBy(urls.id)
      .orderBy(desc(count(urlAccesses.id)))
      .limit(limit);

    return result.map((row) => ({
      url: row.url,
      totalAccesses: Number(row.totalAccesses),
    }));
  }

  async getPeakAccessPeriod(): Promise<{
    date: string;
    accessCount: number;
  } | null> {
    const [result] = await this.db
      .select({
        date: sql<string>`DATE(${urlAccesses.accessedAt})`,
        accessCount: count(urlAccesses.id),
      })
      .from(urlAccesses)
      .groupBy(sql`DATE(${urlAccesses.accessedAt})`)
      .orderBy(desc(count(urlAccesses.id)))
      .limit(1);

    if (!result) return null;

    return {
      date: result.date,
      accessCount: Number(result.accessCount),
    };
  }

  async countByCreatorIp(ip: string, timeWindow: Date): Promise<number> {
    const [result] = await this.db
      .select({ count: count() })
      .from(urls)
      .where(and(eq(urls.creatorIp, ip), gte(urls.createdAt, timeWindow)));

    return Number(result?.count || 0);
  }
}
