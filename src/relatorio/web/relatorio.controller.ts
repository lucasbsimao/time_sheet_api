import { Param, Controller, Logger, Get } from '@nestjs/common';

import { FolhasPontoResponseDto } from './dto/folhas-de-ponto-response.dto';

import { ApiTags } from '@nestjs/swagger';
import { RelatorioService } from '../domain/services/relatorio.service';

@ApiTags('Relatorio')
@Controller("folhas-de-ponto")
export class RelatorioController {
  private readonly logger = new Logger(RelatorioController.name);

  constructor(private readonly relatorioService: RelatorioService) {}

  @Get(':mes')
  async getFolhaDePonto(@Param('mes') mes: string): Promise<FolhasPontoResponseDto> {

    this.logger.log(`RelatorioController::createBatida - Início de processamento`);

    const startTime = new Date();

    const result = await this.relatorioService.retrieve(mes);

    const endTime = new Date()
    this.logger.log(`RelatorioController::createBatida - processo durou ${endTime.getMilliseconds() - startTime.getMilliseconds()} milisegundos`);

    return result;
  }
}