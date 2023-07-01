import { Module } from '@nestjs/common';
import { ExpedienteController } from './web/expediente.controller';
import { ExpedienteService } from './domain/services/expediente.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Expediente, ExpedienteSchema } from './domain/entities/expediente.entity';
import { ExpedienteRepository } from './domain/repositories/expediente.repository';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Expediente.name, schema: ExpedienteSchema }]),
    ],
    providers: [ExpedienteService, ExpedienteRepository],
    controllers: [ExpedienteController],
    exports:[ExpedienteService]
})
export class ExpedienteModule {}
