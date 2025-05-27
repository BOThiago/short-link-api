import { Inject, Injectable } from '@nestjs/common';
import { sql, count } from 'drizzle-orm';
import { Database } from '../../../../shared/database';
import { DATABASE_TOKEN } from '../../../../shared/database/database.module';
import { urlAccesses } from '../../../url/entities/url-access.entity';
import { DailyAccessReportDto } from '../../dto/dailyAccessReport.dto';

@Injectable()
export class GetDailyAccessReportUseCase {
  constructor(@Inject(DATABASE_TOKEN) private readonly db: Database) {}

  async getDailyAccessReport(
    days: number = 30,
  ): Promise<DailyAccessReportDto[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const result = await this.db
      .select({
        date: sql<string>`DATE(${urlAccesses.accessedAt})`,
        accessCount: count(urlAccesses.id),
        uniqueUrls: sql<number>`COUNT(DISTINCT ${urlAccesses.urlId})`,
      })
      .from(urlAccesses)
      .where(sql`${urlAccesses.accessedAt} >= ${startDate}`)
      .groupBy(sql`DATE(${urlAccesses.accessedAt})`)
      .orderBy(sql`DATE(${urlAccesses.accessedAt}) DESC`);

    return result.map((row) => ({
      date: row.date,
      accessCount: Number(row.accessCount),
      uniqueUrls: Number(row.uniqueUrls),
    }));
  }
}
