import { Module } from '@nestjs/common';
import { ExpedienteModule } from './expediente/expediente.module';
import { RelatorioModule } from './relatorio/relatorio.module';

@Module({
  imports: [ExpedienteModule, RelatorioModule],
})
export class AppModule {}
