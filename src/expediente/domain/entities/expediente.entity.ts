import { ConflictException } from "@nestjs/common";

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { isISO8601 } from "class-validator";
import { HydratedDocument } from 'mongoose';
import { ConflitoPontoException } from "src/expediente/common/ConflitoPontoException";
import { ExpedienteException } from "src/expediente/common/ExpedienteException";
import { ExpedienteNotCompatibleException } from "src/expediente/common/ExpedienteNotCompatibleException";

import * as moment from "moment";

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
        const [dia, hora] = diaIso.split("T");
        if(this.dia && this.dia !== dia) return;

        if(this.pontos?.length == 4) throw new ExpedienteNotCompatibleException("Apenas 4 horários podem ser registrados por dia")
        if(!isISO8601(diaIso)) throw new ExpedienteException(`diaIso passado não esta no formato ISO8601 ${diaIso}`)
        
        if(this.pontos?.length == 2 && !this.validateIfLessThen1HourLunch(hora)) 
            throw new ExpedienteNotCompatibleException("Deve haver no mínimo 1 hora de almoço")

        if(this.pontos?.includes(hora))
            throw new ConflitoPontoException({mensagem: "Horário já registrado"});
        
        this.dia = dia;
        
        if(!this.pontos) this.pontos = [hora]
        else this.pontos.push(hora);

    }

    private validateIfLessThen1HourLunch(dia: string){

        let valid = true;
        const hourInSeconds = 60*60;
        this.pontos.forEach(ponto => {
            const duration = moment.duration(moment(ponto, 'HH:mm:ss').diff(moment(dia,'HH:mm:ss')));
            if(Math.abs(duration.asSeconds()) < hourInSeconds) valid = false;
        })
        
        return valid;
    }
}

export const ExpedienteSchema = SchemaFactory.createForClass(Expediente);