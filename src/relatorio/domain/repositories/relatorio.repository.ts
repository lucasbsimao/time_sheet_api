import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Relatorio, RelatorioDocument } from '../entities/relatorio.entity';

@Injectable()
export class RelatorioRepository {
  private readonly logger = new Logger(RelatorioRepository.name);

  constructor(@InjectModel(Relatorio.name) private relatorioModel: Model<Relatorio>) {}

  async findByMes(mes: string): Promise<Relatorio> {
    this.logger.log(`RelatorioRepository::findByMes - Iniciando procura pelo mes ${mes}`)

    try {
      const result = await this.relatorioModel.find({mes}).exec();
      return this.convertModelToEntity(result[0]);
    }catch (err) {
      this.logger.error(`RelatorioRepository::findByMes - Iniciando procura pelo mes ${mes}`)
      throw err;
    }
  }

  async upsert(relatorio: Relatorio): Promise<Relatorio> {
    this.logger.log(`RelatorioRepository::upsert - Iniciando upsert pelo relatorio ${JSON.stringify(relatorio)}`)

    try {
      const result = await this.relatorioModel.findOneAndUpdate({mes: relatorio.mes}, relatorio, {upsert: true, new: true});
      
      if(result)
        return this.convertModelToEntity(result);
      else
        return relatorio;
    }catch (err) {
      this.logger.error(`RelatorioRepository::upsert - Iniciando procura pelo relatorio ${JSON.stringify(relatorio)}`);
      throw err;
    }
  }

  private convertModelToEntity(data: RelatorioDocument) : Relatorio {    
    if(!data) return null;

    const relatorio = new Relatorio();

    relatorio.expedientes = data.expedientes;
    relatorio.horasDevidas = data.horasDevidas;
    relatorio.horasExcedentes = data.horasExcedentes;
    relatorio.horasTrabalhadas = data.horasTrabalhadas;
    relatorio.mes = data.mes;

    return relatorio;
  }
}