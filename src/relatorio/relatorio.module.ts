import { Module, forwardRef } from '@nestjs/common';
import { RelatorioController } from './web/relatorio.controller';
import { RelatorioService } from './domain/services/relatorio.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Relatorio, RelatorioSchema } from './domain/entities/relatorio.entity';
import { RelatorioRepository } from './domain/repositories/relatorio.repository';
import { ExpedienteModule } from 'src/expediente/expediente.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Relatorio.name, schema: RelatorioSchema }]),
        forwardRef(() => ExpedienteModule)
    ],
    providers: [RelatorioService, RelatorioRepository],
    controllers: [RelatorioController],
    exports:[RelatorioService]
})
export class RelatorioModule {}
