import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { ReadyUseCase } from '../../application/use-cases/ready.use-case';
import { ReadyOutputDto } from '../../dto/output/ready.dto';

@ApiTags('Health')
@Controller('health/ready')
export class ReadyController {
  constructor(private readonly readyUseCase: ReadyUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Check application readiness',
    description:
      'Checks if the application and all its dependencies are ready to serve requests.',
  })
  @ApiOkResponse({
    description: 'Application readiness status and dependency details',
    type: ReadyOutputDto,
  })
  getReadiness(): ReadyOutputDto {
    return this.readyUseCase.execute();
  }
}
