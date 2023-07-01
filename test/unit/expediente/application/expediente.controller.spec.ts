
import { Test } from '@nestjs/testing';
import { ExpedienteController } from 'src/expediente/web/expediente.controller';
import { CreateBatidaRequestDto } from 'src/expediente/web/dto/create-batida-request.dto';
import { CreateBatidaResponseDto } from 'src/expediente/web/dto/create-batida-response.dto';
import { ExpedienteService } from 'src/expediente/domain/services/expediente.service';
import { Expediente } from 'src/expediente/domain/entities/expediente.entity';

// import { ExpedienteService } from '../../../../src/expediente/domain/services/expediente.service';


describe('ExpedienteController', () => {
  let expedienteController: ExpedienteController;
  let expedienteService: ExpedienteService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
        controllers: [ExpedienteController],
        providers: [
          {
            provide: ExpedienteService,
            useValue: new ExpedienteService(null),
          },
        ],
      }).compile();

    expedienteService = moduleRef.get<ExpedienteService>(ExpedienteService);
    expedienteController = moduleRef.get<ExpedienteController>(ExpedienteController);
  });

  describe('POST /batidas', () => {
    it('Deve chamar o método POST do endpoint batidas e retornar uma data válida', async () => {
      const dia = "2023-12-22";
      const hora = "12:12:12";

      const createBatidaRequestDto = new CreateBatidaRequestDto(`${dia}T${hora}`);
      
      const expediente = new Expediente(createBatidaRequestDto.momento)
      const createBatidaResponse = new CreateBatidaResponseDto(dia, [hora]);
      
      jest.spyOn(expedienteService, 'create').mockImplementation(async(value: any) => expediente);

      expect(await expedienteController.createBatida(createBatidaRequestDto)).toStrictEqual(createBatidaResponse);
    });
  });
});