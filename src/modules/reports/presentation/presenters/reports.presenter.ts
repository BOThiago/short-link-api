import {
  ReportStatsDto,
  UrlStatsDto,
  TopUrlStatsDto,
  PeakAccessDto,
} from '../../dto';

export interface RawUrlStats {
  date: string;
  accessCount: number;
}

export interface RawTopUrlStats {
  url: {
    id: number;
    shortCode: string;
    originalUrl: string;
    accessCount: number;
    createdAt: Date;
  };
  totalAccesses: number;
}

export interface RawPeakAccess {
  date: string;
  accessCount: number;
  averageAccesses?: number;
}

export class ReportsPresenter {
  static toUrlStats(rawStats: RawUrlStats[]): UrlStatsDto[] {
    return rawStats.map((stat) => ({
      date: stat.date,
      accessCount: stat.accessCount,
    }));
  }

  static toTopUrlStats(rawTopUrls: RawTopUrlStats[]): TopUrlStatsDto[] {
    return rawTopUrls.map((item) => ({
      url: {
        id: item.url.id,
        shortCode: item.url.shortCode,
        originalUrl: item.url.originalUrl,
        accessCount: item.url.accessCount,
        createdAt: item.url.createdAt,
      },
      totalAccesses: item.totalAccesses,
    }));
  }

  static toReportStats(
    dailyStats: RawUrlStats[],
    topUrls: RawTopUrlStats[],
    totalUrls: number,
    totalAccesses: number,
    averageAccessesPerDay: number,
    mostActiveDay: string | null,
  ): ReportStatsDto {
    return {
      dailyStats: this.toUrlStats(dailyStats),
      topUrls: this.toTopUrlStats(topUrls),
      summary: {
        totalUrls,
        totalAccesses,
        averageAccessesPerDay: Math.round(averageAccessesPerDay * 100) / 100,
        mostActiveDay,
      },
    };
  }

  static toPeakAccess(rawPeakAccess: RawPeakAccess): PeakAccessDto {
    const percentageAboveAverage = rawPeakAccess.averageAccesses
      ? ((rawPeakAccess.accessCount - rawPeakAccess.averageAccesses) /
          rawPeakAccess.averageAccesses) *
        100
      : 0;

    return {
      date: rawPeakAccess.date,
      accessCount: rawPeakAccess.accessCount,
      percentageAboveAverage: Math.round(percentageAboveAverage * 100) / 100,
    };
  }

  static calculateSummaryStats(dailyStats: RawUrlStats[]): {
    totalAccesses: number;
    averageAccessesPerDay: number;
    mostActiveDay: string | null;
  } {
    const totalAccesses = dailyStats.reduce(
      (sum, stat) => sum + stat.accessCount,
      0,
    );
    const averageAccessesPerDay =
      dailyStats.length > 0 ? totalAccesses / dailyStats.length : 0;

    const mostActiveDayData = dailyStats.reduce(
      (max, stat) => (stat.accessCount > max.accessCount ? stat : max),
      { date: null, accessCount: 0 },
    );

    return {
      totalAccesses,
      averageAccessesPerDay,
      mostActiveDay:
        mostActiveDayData.accessCount > 0 ? mostActiveDayData.date : null,
    };
  }
}
