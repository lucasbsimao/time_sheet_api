import { Relatorio } from "src/relatorio/domain/entities/relatorio.entity";

describe('Relatorio', () => {
  it('Deve calcular um relatorio parcial do dia e ter seus campos válidos com horas devidas', async () => {
    const pontos = ["12:00:00","08:00:00"];

    const relatorio = new Relatorio();

    relatorio.calculateHoras(pontos)

    expect(relatorio.horasDevidas).toStrictEqual(getHourInSeconds(4));
    expect(relatorio.horasTrabalhadas).toStrictEqual(getHourInSeconds(4));
    expect(relatorio.horasExcedentes).toStrictEqual(0);
  });

  it('Deve calcular um relatorio parcial do dia e ter seus campos válidos com horas excedentes', async () => {
    const pontos = ["20:00:00","08:00:00"];

    const relatorio = new Relatorio();

    relatorio.calculateHoras(pontos)

    expect(relatorio.horasDevidas).toStrictEqual(getHourInSeconds(0));
    expect(relatorio.horasTrabalhadas).toStrictEqual(getHourInSeconds(12));
    expect(relatorio.horasExcedentes).toStrictEqual(getHourInSeconds(4));
  });

  it('Deve calcular um relatorio total do dia e ter seus campos válidos com horas excedentes', async () => {
    const beforeLunch = ["12:00:00","08:00:00"];

    const relatorio = new Relatorio();

    relatorio.calculateHoras(beforeLunch)

    const afterLunch = [...beforeLunch, "13:00:00","18:00:00"];

    relatorio.calculateHoras(afterLunch)

    expect(relatorio.horasDevidas).toStrictEqual(getHourInSeconds(0));
    expect(relatorio.horasTrabalhadas).toStrictEqual(getHourInSeconds(9));
    expect(relatorio.horasExcedentes).toStrictEqual(getHourInSeconds(1));
  });

  it('Deve calcular um relatorio total do dia e ter seus campos válidos com horas devidas', async () => {
    const beforeLunch = ["12:00:00","08:00:00"];

    const relatorio = new Relatorio();

    relatorio.calculateHoras(beforeLunch)

    const afterLunch = [...beforeLunch, "13:00:00","14:00:00"];

    relatorio.calculateHoras(afterLunch)

    expect(relatorio.horasDevidas).toStrictEqual(getHourInSeconds(3));
    expect(relatorio.horasTrabalhadas).toStrictEqual(getHourInSeconds(5));
    expect(relatorio.horasExcedentes).toStrictEqual(getHourInSeconds(0));
  });

  function getHourInSeconds(hour: number) : number {
    return hour*60*60;
  }

});