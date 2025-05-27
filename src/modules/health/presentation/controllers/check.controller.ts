import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { CheckUseCase } from '../../application/use-cases/check.use-case';
import { CheckOutputDto } from '../../dto/output/check.dto';

@ApiTags('Health')
@Controller('health')
export class CheckController {
  constructor(private readonly checkUseCase: CheckUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Check application health',
    description:
      'Performs a comprehensive health check of the application, including uptime, status, and dependency checks.',
  })
  @ApiOkResponse({
    description: 'Application health status and details',
    type: CheckOutputDto,
  })
  getHealth(): CheckOutputDto {
    return this.checkUseCase.execute();
  }
}
