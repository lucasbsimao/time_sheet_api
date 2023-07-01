import { Post, Body, Param, Controller } from '@nestjs/common';

import { Expediente } from '../domain/entities/expediente.entity';

// import { ExpedienteService } from '../domain/services/expediente.service';
import { CreateBatidaRequestDto } from './dto/create-batida-request.dto';

import { ApiTags } from '@nestjs/swagger';

@ApiTags('Expediente')
@Controller()
export class ExpedienteController {

//   constructor(private readonly userService: ExpedienteService) {}

  @Post('batidas')
  async createBatida(@Body() createBatidaDto: CreateBatidaRequestDto): Promise<CreateBatidaRequestDto> {
    return createBatidaDto;
  }
}