import { Module } from '@nestjs/common';
import { ExpedienteModule } from './expediente/expediente.module';
import { RelatorioModule } from './relatorio/relatorio.module';
import { MongooseModule } from '@nestjs/mongoose';


const mongoModule = MongooseModule.forRoot('mongodb://localhost:27017/timesheet')
@Module({
  imports: [ExpedienteModule, RelatorioModule, mongoModule],
})
export class AppModule {}
