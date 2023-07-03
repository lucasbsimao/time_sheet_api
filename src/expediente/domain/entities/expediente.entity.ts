import { ConflictException } from "@nestjs/common";

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { isISO8601 } from "class-validator";
import { HydratedDocument } from 'mongoose';
import { ConflitoPontoException } from "src/expediente/common/ConflitoPontoException";
import { ExpedienteException } from "src/expediente/common/ExpedienteException";

export type ExpedienteDocument = HydratedDocument<Expediente>;

@Schema()
export class Expediente{    
    constructor(diaIso?: string) {
        if(diaIso) this.addBatida(diaIso);
    }
    
    @Prop({required: true, index: true})
    dia: string;
    
    @Prop()
    pontos: string[];

    addBatida(diaIso: string) {
        if(!isISO8601(diaIso)) throw new ExpedienteException(`diaIso passado não esta no formato ISO8601 ${diaIso}`)

        const [dia, hora] = diaIso.split("T");

        if(this.dia && this.dia !== dia)
            return;

        if(this.pontos?.includes(hora))
            throw new ConflitoPontoException({mensagem: "Horário já registrado"});
        
        this.dia = dia;
        
        if(!this.pontos) this.pontos = [hora]
        else this.pontos.push(hora);

    }
}

export const ExpedienteSchema = SchemaFactory.createForClass(Expediente);