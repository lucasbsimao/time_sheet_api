import { IsISO8601, IsNotEmpty } from "class-validator";
import * as moment from "moment";

export class CreateBatidaRequestDto {
    
    constructor(momento: string) {
        this.momento = momento;
    }
    
    @IsISO8601({strict: true}, {message: "Data e hora em formato inválido"})
    @IsNotEmpty({message: "Campo obrigatório não informado"})
    momento: string;

    extractDia(): string {
        return this.momento?.split("T")[0];
    }

    isWeekendDate(): Boolean {
        return [0,6].includes(moment(this.momento).weekday()); 
    }
}