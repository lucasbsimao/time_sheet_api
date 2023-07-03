import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expediente, ExpedienteDocument } from '../entities/expediente.entity';

@Injectable()
export class ExpedienteRepository {
  private readonly logger = new Logger(ExpedienteRepository.name);

  constructor(@InjectModel(Expediente.name) private expedienteModel: Model<Expediente>) {}

  async findByDia(dia: string): Promise<Expediente> {
    this.logger.log(`ExpedienteRepository::findByDia - Iniciando procura pelo dia ${dia}`)

    
    try {
      const result = await this.expedienteModel.findOne({dia}).exec();
      return this.convertModelToEntity(result);
    }catch (err) {
      this.logger.error(`ExpedienteRepository::findByDia - Iniciando procura pelo dia ${dia}`)
      throw err;
    }
  }

  async upsert(expediente: Expediente): Promise<Expediente> {
    this.logger.log(`ExpedienteRepository::upsert - Iniciando upsert pelo expediente ${JSON.stringify(expediente)}`)

    
    try {
      const result = await this.expedienteModel.findOneAndUpdate({dia: expediente.dia}, expediente, {upsert: true, new: true});
      
      if(result)
        return this.convertModelToEntity(result);
      else
        return expediente;
    }catch (err) {
      this.logger.error(`ExpedienteRepository::upsert - Iniciando procura pelo expediente ${JSON.stringify(expediente)}`);
      throw err;
    }
  }

  private convertModelToEntity(data: ExpedienteDocument) : Expediente {
    if(!data) return null;
    
    const expediente = new Expediente();

    expediente.dia = data.dia;
    expediente.pontos = data.pontos;

    return expediente;
  }
}