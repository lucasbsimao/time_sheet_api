import { ConflictException } from "@nestjs/common";

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ExpedienteDocument = HydratedDocument<Expediente>;

@Schema()
export class Expediente {
    constructor(diaIso: string) {
        this.addBatida(diaIso);
    }
    
    @Prop()
    dia: string;
    
    @Prop()
    pontos: string[];

    addBatida(diaIso: string) {
        const [dia, hora] = diaIso.split("T");

        console.log(dia)

        if(this.dia && this.dia !== dia)
            return;

        if(this.pontos.includes(hora))
            throw new ConflictException({mensagem: "Horário já registrado"})
        
        this.dia = dia;
        this.pontos.push(diaIso);

    }
}

export const ExpedienteSchema = SchemaFactory.createForClass(Expediente);