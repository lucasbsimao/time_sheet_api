
export class CreateBatidaResponseDto {

    constructor(dia: string, pontos: string[]){
        this.dia = dia;
        this.pontos = pontos;
    }

    dia: string;

    pontos: string[];
}