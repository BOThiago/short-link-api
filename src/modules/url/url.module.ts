import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { UrlController } from './presenters/controllers/url.controller';
import { RedirectController } from './presenters/controllers/redirect.controller';
import { UrlService } from './url.service';
import { UrlRepository } from './repositories/url.repository';

@Module({
  imports: [
    ConfigModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minuto
        limit: 10, // 10 requests
      },
    ]),
  ],
  controllers: [UrlController, RedirectController],
  providers: [UrlService, UrlRepository],
  exports: [UrlService, UrlRepository],
})
export class UrlModule {}
