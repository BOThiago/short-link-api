import { Module } from '@nestjs/common';
import { UrlModule } from '../url/url.module';
import { ReportsController } from './presentation/controllers/reports.controller';
import { ReportsService } from './application/reports.service';

@Module({
  imports: [UrlModule],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
