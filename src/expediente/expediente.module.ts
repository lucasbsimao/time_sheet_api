import { Module } from '@nestjs/common';
import { ExpedienteController } from './web/expediente.controller';

@Module({
    controllers: [ExpedienteController],
})
export class ExpedienteModule {}
