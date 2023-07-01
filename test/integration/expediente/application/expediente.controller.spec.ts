
import { Test } from '@nestjs/testing';
import { ExpedienteController } from 'src/expediente/web/expediente.controller';
import { CreateBatidaRequestDto } from 'src/expediente/web/dto/create-batida-request.dto';
import { CreateBatidaResponseDto } from 'src/expediente/web/dto/create-batida-response.dto';
import { ExpedienteService } from 'src/expediente/domain/services/expediente.service';

// import { ExpedienteService } from '../../../../src/expediente/domain/services/expediente.service';


describe('ExpedienteController', () => {
  let expedienteController: ExpedienteController;
  // let expedienteService: ExpedienteService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
        controllers: [ExpedienteController],
        providers: [ExpedienteService],
      }).compile();

    expedienteController = moduleRef.get<ExpedienteController>(ExpedienteController);
  });

  describe('Expediente', () => {
    it('Deve chamar o método POST do endpoint batidas e retornar uma data válida', async () => {

      const dia = "2023-12-22";
      const hora = "12:12:12";

      const createBatidaRequestDto = new CreateBatidaRequestDto(`${dia}T${hora}`);
      
      const createBatidaResponse = new CreateBatidaResponseDto(dia, [hora]);
      // jest.spyOn(expedienteService, 'findAll').mockImplementation(() => result);

      expect(await expedienteController.createBatida(createBatidaRequestDto)).toBe(createBatidaResponse);
    });
  });
});