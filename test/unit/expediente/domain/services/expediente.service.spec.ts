import { Test } from '@nestjs/testing';
import { CreateBatidaRequestDto } from 'src/expediente/web/dto/create-batida-request.dto';
import { ExpedienteService } from 'src/expediente/domain/services/expediente.service';
import { Expediente } from 'src/expediente/domain/entities/expediente.entity';
import { ExpedienteRepository } from 'src/expediente/domain/repositories/expediente.repository';
import { ConflictException } from '@nestjs/common';

describe('ExpedienteService', () => {
  let expedienteRepository: ExpedienteRepository;
  let expedienteService: ExpedienteService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
        providers: [
          ExpedienteService,
          {
            provide: ExpedienteRepository,
            useValue: new ExpedienteRepository(null),
          },
        ],
      }).compile();

    expedienteService = moduleRef.get<ExpedienteService>(ExpedienteService);
    expedienteRepository = moduleRef.get<ExpedienteRepository>(ExpedienteRepository);
  });

  describe('create', () => {
    it('Deve retornar uma entidade Experience válida com uma batida de ponto quando receber um CreateBatidaRequestDto válido e que não esteja registrado no banco', async () => {
      const dia = "2023-12-22";
      const hora = "12:12:12";

      const createBatidaRequestDto = new CreateBatidaRequestDto(`${dia}T${hora}`);
      const expediente = new Expediente(createBatidaRequestDto.momento);
      
      jest.spyOn(expedienteRepository, 'findByDia').mockImplementation(async(value: any) => null);
      jest.spyOn(expedienteRepository, 'upsert').mockImplementation(async(value: any) => value);

      const result = await expedienteService.create(createBatidaRequestDto)

      expect(result).toStrictEqual(expediente);
      expect(expedienteRepository.upsert).toBeCalledWith(expediente);
    });
  });

  it('Deve retornar uma entidade Experience válida com duas batidas de ponto quando receber um CreateBatidaRequestDto válido e que já esteja registrado no banco', async () => {
    const dia = "2023-12-22";
    const hora = "12:12:12";

    const createBatidaRequestDto = new CreateBatidaRequestDto(`${dia}T${hora}`);
    
    const horaAnterior = "08:12:12";
    const returnedExpediente = new Expediente(`${dia}T${horaAnterior}`);
    
    const expectedExpediente = new Expediente(`${dia}T${horaAnterior}`);
    expectedExpediente.addBatida(createBatidaRequestDto.momento)
    
    jest.spyOn(expedienteRepository, 'findByDia').mockImplementation(async(value: any) => returnedExpediente);
    jest.spyOn(expedienteRepository, 'upsert').mockImplementation(async(value: any) => value);

    const result = await expedienteService.create(createBatidaRequestDto);

    expect(result).toEqual(expectedExpediente);
  });

  it('Deve lançar um erro do tipo ConflitoPontoException quando receber um CreateBatidaRequestDto válido mas que já esteja registrado no banco', async () => {
    const dia = "2023-12-22";
    const hora = "12:12:12";

    const createBatidaRequestDto = new CreateBatidaRequestDto(`${dia}T${hora}`);
    const returnedExpediente = new Expediente(`${dia}T${hora}`);

    jest.spyOn(expedienteRepository, 'findByDia').mockImplementation(async(value: any) => returnedExpediente);

    expect(expedienteService.create(createBatidaRequestDto)).rejects.toThrow(ConflictException);
  });
});