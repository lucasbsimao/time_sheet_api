import { assert } from "console";
import { ConflitoPontoException } from "src/expediente/common/ConflitoPontoException";
import { ExpedienteException } from "src/expediente/common/ExpedienteException";
import { Expediente } from "src/expediente/domain/entities/expediente.entity";

describe('ExpedienteEntity', () => {

  describe('Expediente', () => {
    it('Deve retornar um objeto Expediente preenchido quando passar um diaIso válido', async () => {
      const dia = "2023-12-22";
      const hora = "12:12:12";

      const expediente = new Expediente(`${dia}T${hora}`)

      expect(expediente.dia).toStrictEqual(dia);
      expect(expediente.pontos).toStrictEqual([hora]);
    });

    it('Deve lançar um erro do tipo ExpedienteException quando passar um diaIso inválido', async () => {
      const dia = "teste";

      expect(() => new Expediente(dia)).toThrow(ExpedienteException);
    });

    it('Deve lançar um erro do tipo ConflitoPontoException quando passar um diaIso com ponto já registrado', async () => {
      const dia = "2023-12-22";
      const hora = "12:12:12";

      const expediente = new Expediente(`${dia}T${hora}`)

      expect(() => expediente.addBatida(`${dia}T${hora}`)).toThrow(ConflitoPontoException);
    });
  });
});