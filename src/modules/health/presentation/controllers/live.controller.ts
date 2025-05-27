import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { LiveUseCase } from '../../application/use-cases/live.use-case';
import { LiveOutputDto } from '../../dto/output/live.dto';

@ApiTags('Health')
@Controller('health/live')
export class LiveController {
  constructor(private readonly liveUseCase: LiveUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Check application liveness',
    description:
      'Checks if the application is alive and responsive. Used by container orchestrators to determine if the application should be restarted.',
  })
  @ApiOkResponse({
    description: 'Application liveness status and runtime details',
    type: LiveOutputDto,
  })
  getLiveness(): LiveOutputDto {
    return this.liveUseCase.execute();
  }
}
