import { Post, Body, Controller, Logger } from '@nestjs/common';

import { CreateBatidaRequestDto } from './dto/create-batida-request.dto';
import { CreateBatidaResponseDto } from './dto/create-batida-response.dto';

import { ApiTags } from '@nestjs/swagger';
import { ExpedienteService } from '../domain/services/expediente.service';

@ApiTags('Expediente')
@Controller()
export class ExpedienteController {
  private readonly logger = new Logger(ExpedienteController.name);

  constructor(private readonly expedienteService: ExpedienteService) {}

  @Post('batidas')
  async createBatida(@Body() createBatidaDto: CreateBatidaRequestDto): Promise<CreateBatidaResponseDto> {

    this.logger.log(`ExpedienteController::createBatida - Início de processamento`);

    const startTime = new Date();
    const result = await this.expedienteService.create(createBatidaDto);

    const endTime = new Date()
    this.logger.log(`ExpedienteController::createBatida - processo durou ${endTime.getMilliseconds() - startTime.getMilliseconds()} milisegundos`);

    return new CreateBatidaResponseDto(result.dia, result.pontos);
  }
}