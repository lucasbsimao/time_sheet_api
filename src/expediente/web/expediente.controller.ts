import { Post, Body, Param, Controller } from '@nestjs/common';

import { CreateBatidaRequestDto } from './dto/create-batida-request.dto';
import { CreateBatidaResponseDto } from './dto/create-batida-response.dto';

import { ApiTags } from '@nestjs/swagger';
import { ExpedienteService } from '../domain/services/expediente.service';

@ApiTags('Expediente')
@Controller()
export class ExpedienteController {

  constructor(private readonly expedienteService: ExpedienteService) {}

  @Post('batidas')
  async createBatida(@Body() createBatidaDto: CreateBatidaRequestDto): Promise<CreateBatidaResponseDto> {

    const result = await this.expedienteService.create(createBatidaDto);


    return new CreateBatidaResponseDto(result.dia, result.pontos);
  }
}