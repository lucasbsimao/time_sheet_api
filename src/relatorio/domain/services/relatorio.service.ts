import { Inject, Injectable, Logger, NotFoundException, forwardRef } from '@nestjs/common';
import { Relatorio } from '../entities/relatorio.entity';
import { RelatorioRepository } from '../repositories/relatorio.repository';
import { ExpedienteService } from 'src/expediente/domain/services/expediente.service';
import * as moment from 'moment';
import { FolhasPontoResponseDto } from 'src/relatorio/web/dto/folhas-de-ponto-response.dto';
import { NotAbleToComputeException } from 'src/relatorio/common/NotAbleToComputeException';

@Injectable()
export class RelatorioService {
  private readonly logger = new Logger(RelatorioService.name);

  constructor(
    private relatorioRepository: RelatorioRepository,
    @Inject(forwardRef(() => ExpedienteService))
    private expedienteService: ExpedienteService
  ) {}

  async retrieve(mes: string): Promise<FolhasPontoResponseDto> {
    this.logger.log(`RelatorioService::retrieve - Iniciando retrive do mês ${mes}`);

    let relatorio: Relatorio;
    let expedientes;
    
    try{
      relatorio = await this.relatorioRepository.findByMes(mes);
    } catch (err) {
      this.logger.error(`RelatorioService::retrieve - Erro ao processar ${mes}`);
      throw err;
    }

    if(!relatorio) throw new NotFoundException({mensagem:"Relatório não encontrado"});
    
    this.logger.debug(`RelatorioService::retrieve - expedienteService.findByDias ${relatorio.expedientes}`);
    
    try {
      expedientes = await this.expedienteService.findByDias(relatorio.expedientes);
    } catch (err) {
      this.logger.error(`RelatorioService::retrieve - Erro ao processar ${mes}`);
      throw err;
    }

    this.logger.verbose(`RelatorioService::retrieve - FolhasPontoResponseDto.Builder.build() ${JSON.stringify(relatorio)}`);
    
    return FolhasPontoResponseDto.Builder
                  .withHorasDevidasFromNSeconds(relatorio.horasDevidas)
                  .withHorasExcedentesFromNSeconds(relatorio.horasExcedentes)
                  .withHorasTrabalhadasFromNSeconds(relatorio.horasTrabalhadas)
                  .withExpedientes(expedientes)
                  .withMes(mes)
                  .build();
  }

  //Seguindo as definições de DDD, é importante não passarmos diretamente Expediente como parâmetro para não criarmos um "tight coupling" entre os agregados. Por isso passamos apenas os dados necessários. Outra opção é passar em forma de DTO
  //Optei pela abordagem de adicionar expedientes conforme fossem feitas as batidas ao invés de só computar quando o endpoint de folha-de-pontos fosse chamada, pois dessa forma é bem mais performático
  async addExpedienteToRelatorio(dia: string, pontos: string[]) {
    this.logger.log(`RelatorioService::addExpedienteToRelatorio - Iniciando adição de referencia do expediente ${dia} : ${JSON.stringify(pontos)}`);

    if(pontos.length%2 !== 0) throw new NotAbleToComputeException("Para calcular o intervalo de tempo é necessário o array possua duas batidas de pontos");

    const mes = moment(dia, "yyyy-mm-dd").format("yyyy-mm").toString();
    let relatorio: Relatorio;
    
    try {
      relatorio = await this.relatorioRepository.findByMes(mes);
    } catch(err) {
      this.logger.error(`RelatorioService::addExpedienteToRelatorio - relatorioRepository.findByMes ${mes}`);
      throw err;
    }

    if(!relatorio) relatorio = new Relatorio();

    relatorio.calculateHoras(pontos);
    relatorio.addExpediente(dia);
    relatorio.mes = mes;

    this.logger.verbose(`RelatorioService::retrieve - FolhasPontoResponseDto.Builder.build() ${JSON.stringify(relatorio)}`);

    this.relatorioRepository.upsert(relatorio);
    
  }
}