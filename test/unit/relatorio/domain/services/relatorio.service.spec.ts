import { Test } from '@nestjs/testing';
import { RelatorioService } from 'src/relatorio/domain/services/relatorio.service';
import { RelatorioRepository } from 'src/relatorio/domain/repositories/relatorio.repository';
import { Relatorio } from 'src/relatorio/domain/entities/relatorio.entity';
import { ExpedienteService } from 'src/expediente/domain/services/expediente.service';
import { NotAbleToComputeException } from 'src/relatorio/common/NotAbleToComputeException';
import { NotFoundException } from '@nestjs/common';

describe('RelatorioService', () => {
  let relatorioRepository: RelatorioRepository;
  let relatorioService: RelatorioService;
  let expedienteService: ExpedienteService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
        providers: [
          RelatorioService,
          {
            provide: ExpedienteService,
            useValue: new ExpedienteService(null,null),
          },
          {
            provide: RelatorioRepository,
            useValue: new RelatorioRepository(null),
          },
        ],
      }).compile();

    relatorioService = moduleRef.get<RelatorioService>(RelatorioService);
    expedienteService = moduleRef.get<ExpedienteService>(ExpedienteService);
    relatorioRepository = moduleRef.get<RelatorioRepository>(RelatorioRepository);
  });

  describe('upsert', () => {
    it('Deve chamar relatorioRepository.upsert com um objeto Relatorio válido quando receber parametros válidos', async () => {
      const mes = "2023-12"
      const dia = `${mes}-22`;
      const pontos = ["12:00:00","08:00:00"];

      const relatorio = new Relatorio();

      relatorio.calculateHoras(pontos);
      relatorio.addExpediente(dia);
      relatorio.mes = mes;
      
      let upsertedRelatorio: Relatorio;
      jest.spyOn(relatorioRepository, 'findByMes').mockImplementation(async(value: any) => null);
      jest.spyOn(relatorioRepository, 'upsert').mockImplementation(async(value: any) => {
        upsertedRelatorio = value;
        return value;
      });

      await relatorioService.addExpedienteToRelatorio(dia, pontos);

      expect(relatorio.expedientes).toStrictEqual(upsertedRelatorio.expedientes);
      expect(relatorio.horasDevidas).toStrictEqual(upsertedRelatorio.horasDevidas);
      expect(relatorio.horasExcedentes).toStrictEqual(upsertedRelatorio.horasExcedentes);
      expect(relatorio.horasTrabalhadas).toStrictEqual(upsertedRelatorio.horasTrabalhadas);
      expect(relatorio.mes).toStrictEqual(upsertedRelatorio.mes);
      expect(relatorioRepository.upsert).toBeCalledTimes(1);
      expect(relatorioRepository.findByMes).toBeCalledTimes(1);
    });

    it('Deve chamar relatorioRepository.upsert com um objeto Relatorio válido com pontos preenchidos quando receber parametros válidos', async () => {
      const mes = "2023-12"
      const dia = `${mes}-22`;
      const beforeLunch = ["12:00:00","08:00:00"];

      const afterLunch = [...beforeLunch, "13:00:00","14:00:00"];

      const relatorio = new Relatorio();

      relatorio.calculateHoras(beforeLunch);
      relatorio.addExpediente(dia);
      relatorio.mes = mes;
      
      let upsertedRelatorio: Relatorio;
      jest.spyOn(relatorioRepository, 'findByMes').mockImplementation(async(value: any) => relatorio);
      jest.spyOn(relatorioRepository, 'upsert').mockImplementation(async(value: any) => {
        upsertedRelatorio = value;
        return value;
      });

      relatorio.calculateHoras(afterLunch);

      await relatorioService.addExpedienteToRelatorio(dia, afterLunch);

      expect(relatorio.expedientes).toStrictEqual(upsertedRelatorio.expedientes);
      expect(relatorio.horasDevidas).toStrictEqual(upsertedRelatorio.horasDevidas);
      expect(relatorio.horasExcedentes).toStrictEqual(upsertedRelatorio.horasExcedentes);
      expect(relatorio.horasTrabalhadas).toStrictEqual(upsertedRelatorio.horasTrabalhadas);
      expect(relatorio.mes).toStrictEqual(upsertedRelatorio.mes);
      expect(relatorioRepository.upsert).toBeCalledTimes(1);
      expect(relatorioRepository.findByMes).toBeCalledTimes(1);
    });

    it('Deve chamar relatorioRepository.upsert com um objeto Relatorio válido com pontos preenchidos quando receber parametros válidos', async () => {
      const mes = "2023-12"
      const dia = `${mes}-22`;
      const beforeLunch = ["12:00:00","08:00:00"];

      const afterLunch = [...beforeLunch, "13:00:00"];

      expect(relatorioService.addExpedienteToRelatorio(dia, afterLunch)).rejects.toThrow(NotAbleToComputeException);

      
    });
  });

  describe('retrieve',() => {
    it('Deve chamar relatorioRepository.upsert com um objeto Relatorio válido quando receber parametros válidos', async () => {
      const mes = "2023-12"
      const dia = `${mes}-22`;
      const beforeLunch = ["12:00:00","08:00:00"];

      const afterLunch = [...beforeLunch, "13:00:00", "14:00:00"];

      const expedientes = [{
        dia,
        pontos: afterLunch,
        addBatida: () => (null)
      }];

      const relatorio = new Relatorio();

      relatorio.calculateHoras(beforeLunch);
      relatorio.addExpediente(dia);
      relatorio.mes = mes;

      jest.spyOn(relatorioRepository, 'findByMes').mockImplementation(async(value: any) => relatorio);
      jest.spyOn(expedienteService, 'findByDias').mockImplementation(async() => expedientes);

      const result = await relatorioService.retrieve(mes);

      expect(relatorio.expedientes[0]).toStrictEqual(result.expedientes[0].dia);
      expect(relatorio.horasDevidas).toStrictEqual(getHourInSeconds(4));
      expect(relatorio.horasExcedentes).toStrictEqual(0);
      expect(relatorio.horasTrabalhadas).toStrictEqual(getHourInSeconds(4));
      expect(relatorio.mes).toStrictEqual(result.mes);
      expect(expedienteService.findByDias).toBeCalledTimes(1);
      expect(relatorioRepository.findByMes).toBeCalledTimes(1);
    });

    it('Deve chamar expedienteService.findByDias zero vezes e lançar a exceção do tipo NotFoundException', async () => {
      const mes = "2023-12"

      jest.spyOn(relatorioRepository, 'findByMes').mockImplementation(async(value: any) => null);
      jest.spyOn(expedienteService, 'findByDias').mockImplementation(async() => null);

      expect(relatorioService.retrieve(mes)).rejects.toThrow(NotFoundException);

      expect(expedienteService.findByDias).toBeCalledTimes(0);
      expect(relatorioRepository.findByMes).toBeCalledTimes(1);
    });

    function getHourInSeconds(hour: number) : number {
      return hour*60*60;
    }
  });
});