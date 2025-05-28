import { Controller, Get, Param, Res, Req, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UrlService } from '../../url.service';
import { NotFoundErrorResponseDto } from '../../dto';

@ApiTags('Redirect')
@Controller()
export class RedirectController {
  constructor(private readonly urlService: UrlService) {}

  @Get(':shortCode')
  @ApiOperation({
    summary: 'Redirect to original URL',
    description:
      'Redirects to the original URL associated with the short code. Also tracks access statistics including user agent, IP address, and referrer.',
  })
  @ApiParam({
    name: 'shortCode',
    description: 'Short code of the URL to redirect to',
    example: 'abc123',
    type: 'string',
  })
  @ApiResponse({
    status: 302,
    description: 'Successfully redirected to original URL',
  })
  @ApiNotFoundResponse({
    description: 'URL not found, expired, or invalid short code',
    type: NotFoundErrorResponseDto,
  })
  async redirectToUrl(
    @Param('shortCode') shortCode: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const userAgent = req.get('User-Agent') || 'Unknown';
      const ipAddress = req.ip || req.connection.remoteAddress || 'Unknown';
      const referer = req.get('Referer');

      const originalUrl = await this.urlService.accessUrl(
        shortCode,
        userAgent,
        ipAddress,
        referer,
      );

      return res.redirect(HttpStatus.FOUND, originalUrl);
    } catch (error) {
      const errorResponse: NotFoundErrorResponseDto = {
        statusCode: HttpStatus.NOT_FOUND,
        message: error.message || 'URL not found or expired',
        error: 'NOT_FOUND',
        timestamp: new Date().toISOString(),
        path: req.path,
      };

      return res.status(HttpStatus.NOT_FOUND).json(errorResponse);
    }
  }
}
