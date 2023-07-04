import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { Expediente } from '../entities/expediente.entity';
import { CreateBatidaRequestDto } from 'src/expediente/web/dto/create-batida-request.dto';
import { ExpedienteRepository } from '../repositories/expediente.repository';
import { ConflitoPontoException } from 'src/expediente/common/ConflitoPontoException';
import { RelatorioService } from 'src/relatorio/domain/services/relatorio.service';
import { ExpedienteBadRequestException } from 'src/expediente/common/ExpedienteBadRequestException';
import { ExpedienteNotCompatibleException } from 'src/expediente/common/ExpedienteNotCompatibleException';

@Injectable()
export class ExpedienteService {
  private readonly logger = new Logger(ExpedienteService.name);

  constructor(
    private expedienteRepository: ExpedienteRepository,
    private relatorioService: RelatorioService
  ) {}

  async findByDias(dias: string[]): Promise<Expediente[]>{
    this.logger.log(`ExpedienteService::findByDias - Iniciando findByDias para ${dias.length} dias`);
    return this.expedienteRepository.findByDias(dias);
  }

  async create(createBatidaDto: CreateBatidaRequestDto): Promise<Expediente> {
    this.logger.log(`ExpedienteService::create - Iniciando create pelo CreateBatidaRequestDto ${JSON.stringify(createBatidaDto)}`);

    if(createBatidaDto.isWeekendDate()) throw new ExpedienteBadRequestException("Sábado e domingo não são permitidos como dia de trabalho")

    let expediente: Expediente;
    try {
      expediente = await this.expedienteRepository.findByDia(createBatidaDto.extractDia());
      
      if(expediente)
        expediente.addBatida(createBatidaDto.momento);
      else
        expediente = new Expediente(createBatidaDto.momento);

    } catch (err) {
      if (err instanceof ConflitoPontoException) throw new ConflictException(err.desc);
      if (err instanceof ExpedienteNotCompatibleException) throw new ExpedienteBadRequestException(err.message);
      throw err;
    }
  
    this.logger.debug(`ExpedienteService::create - expedienteRepository.upsert ${JSON.stringify(expediente)}`);
    const result = await this.expedienteRepository.upsert(expediente);

    if(expediente.pontos.length%2 === 0) await this.relatorioService.addExpedienteToRelatorio(expediente.dia, expediente.pontos);
    
    this.logger.verbose(`ExpedienteService::create - retornando objeto processado ${JSON.stringify(result)}`);
    return result;
  }
}