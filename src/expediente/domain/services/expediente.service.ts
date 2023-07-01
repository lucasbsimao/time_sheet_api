import { Injectable, Logger } from '@nestjs/common';
import { Expediente } from '../entities/expediente.entity';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';
import { CreateBatidaRequestDto } from 'src/expediente/web/dto/create-batida-request.dto';
import { ExpedienteRepository } from '../repositories/expediente.repository';

@Injectable()
export class ExpedienteService {
  private readonly logger = new Logger(ExpedienteService.name);

  constructor(
    private expedienteRepository: ExpedienteRepository
  ) {}

  private async findById(id : string): Promise<Expediente> {

    return null;
  }

  async create(createBatidaDto: CreateBatidaRequestDto): Promise<Expediente> {

    const expediente = new Expediente(createBatidaDto.momento);

    this.logger.log("testest " + createBatidaDto.momento)

    const result = this.expedienteRepository.create(expediente);
    
    return result;
  }
}