import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { Expediente } from '../entities/expediente.entity';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';
import { CreateBatidaRequestDto } from 'src/expediente/web/dto/create-batida-request.dto';
import { ExpedienteRepository } from '../repositories/expediente.repository';
import { ConflitoPontoException } from 'src/expediente/common/ConflitoPontoException';

@Injectable()
export class ExpedienteService {
  private readonly logger = new Logger(ExpedienteService.name);

  constructor(
    private expedienteRepository: ExpedienteRepository
  ) {}

  async create(createBatidaDto: CreateBatidaRequestDto): Promise<Expediente> {
    this.logger.log(`ExpedienteService::create - Iniciando create pelo CreateBatidaRequestDto ${JSON.stringify(createBatidaDto)}`);

    let expediente = await this.expedienteRepository.findByDia(createBatidaDto.extractDia());

    try {
      if(expediente)
        expediente.addBatida(createBatidaDto.momento)
      else
        expediente = new Expediente(createBatidaDto.momento);
    } catch (err) {
      if (err instanceof ConflitoPontoException) throw new ConflictException(err.desc);
      throw err;
    }
  
    this.logger.debug(`ExpedienteService::create - expedienteRepository.upsert ${JSON.stringify(expediente)}`);
    const result = await this.expedienteRepository.upsert(expediente);
    

    this.logger.verbose(`ExpedienteService::create - retornando objeto processado ${JSON.stringify(result)}`);
    return result;
  }
}