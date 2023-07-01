import { IsISO8601 } from "class-validator";

export class CreateBatidaRequestDto {
    
    constructor(momento: string) {
        this._momento = momento;
    }
    
    @IsISO8601()
    private _momento: string;

    get momento(): string {
        return this._momento;
    }

    set momento(momento: string) {
        this._momento = momento;
    }

    
}