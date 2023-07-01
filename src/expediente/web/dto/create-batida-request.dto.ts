import { IsISO8601 } from "class-validator";

export class CreateBatidaRequestDto {
    
    constructor(momento: string) {
        this.momento = momento;
    }
    
    @IsISO8601()
    private momento: string;

    
}