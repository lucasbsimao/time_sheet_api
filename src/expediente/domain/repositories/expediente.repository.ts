import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expediente } from '../entities/expediente.entity';

@Injectable()
export class ExpedienteRepository {
  constructor(@InjectModel(Expediente.name) private expedienteModel: Model<Expediente>) {}

  async create(expediente: Expediente): Promise<Expediente> {

    const result = await this.expedienteModel.create(expediente);
    return result;
  }
}