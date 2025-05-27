import { Injectable } from '@nestjs/common';
import { UrlRepository } from '../../url/repositories/url.repository';
import {
  ReportStatsDto,
  UrlStatsDto,
  TopUrlStatsDto,
} from '../dto/report-stats.dto';
import { PeakAccessDto } from '../dto/peak-access.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly urlRepository: UrlRepository) {}

  async getDailyStats(days: number = 30): Promise<UrlStatsDto[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const stats = await this.urlRepository.getUrlStatsByDateRange(
      startDate,
      endDate,
    );

    const filledStats: UrlStatsDto[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const existingStat = stats.find((stat) => stat.date === dateStr);

      filledStats.push({
        date: dateStr,
        accessCount: existingStat ? existingStat.accessCount : 0,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return filledStats;
  }

  async getTopUrls(limit: number = 10): Promise<TopUrlStatsDto[]> {
    return this.urlRepository.getTopUrlsByAccesses(limit);
  }

  async getPeakAccessPeriod(): Promise<PeakAccessDto | null> {
    const peakData = await this.urlRepository.getPeakAccessPeriod();
    if (!peakData) return null;

    const dailyStats = await this.getDailyStats(30);
    const totalAccesses = dailyStats.reduce(
      (sum, stat) => sum + stat.accessCount,
      0,
    );
    const averageAccesses =
      dailyStats.length > 0 ? totalAccesses / dailyStats.length : 0;

    const percentageAboveAverage =
      averageAccesses > 0
        ? ((peakData.accessCount - averageAccesses) / averageAccesses) * 100
        : 0;

    return {
      date: peakData.date,
      accessCount: peakData.accessCount,
      percentageAboveAverage: Math.round(percentageAboveAverage * 100) / 100,
    };
  }

  private async getSummary() {
    const dailyStats = await this.getDailyStats(30);
    const totalAccesses = dailyStats.reduce(
      (sum, stat) => sum + stat.accessCount,
      0,
    );
    const averageAccessesPerDay =
      dailyStats.length > 0 ? totalAccesses / dailyStats.length : 0;

    const mostActiveDayData = dailyStats.reduce(
      (max, stat) => (stat.accessCount > max.accessCount ? stat : max),
      { date: '', accessCount: 0 },
    );

    return {
      totalUrls: 0,
      totalAccesses,
      averageAccessesPerDay: Math.round(averageAccessesPerDay * 100) / 100,
      mostActiveDay:
        mostActiveDayData.accessCount > 0 ? mostActiveDayData.date : null,
    };
  }

  async getReportStats(
    days: number = 30,
    topUrlsLimit: number = 10,
  ): Promise<ReportStatsDto> {
    const [dailyStats, topUrls, summary] = await Promise.all([
      this.getDailyStats(days),
      this.getTopUrls(topUrlsLimit),
      this.getSummary(),
    ]);

    return {
      dailyStats,
      topUrls,
      summary,
    };
  }
}
