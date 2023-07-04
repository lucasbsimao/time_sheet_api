import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as moment from 'moment'
import { NotAbleToComputeException } from 'src/relatorio/common/NotAbleToComputeException';

export type RelatorioDocument = HydratedDocument<Relatorio>;

@Schema()
export class Relatorio{    
    @Prop({required: true, index: true})
    mes: string;

    //Para mantermos a linguagem onipresente, mantemos a parte principal dos campos em português e o restante de acordo com o código
    @Prop()
    horasTrabalhadasInSeconds: number = 0;

    @Prop()
    horasExcedentesInSeconds: number  = 0;

    @Prop()
    horasDevidasInSeconds: number  = 0;
    
    //Seguindo DDD, um agregado só deve fazer referencia ao domínio de outro através da chave do entidade raiz do agregado
    @Prop()
    expedientes: string[] = [];

    addExpediente(dia: string) {
        if(!this.expedientes.includes(dia)) this.expedientes.push(dia);
    }

    calculateHoras(pontos: string[]) {
        if(pontos.length%2 !== 0) throw new NotAbleToComputeException("Para calcular o intervalo de tempo é necessário o array possua duas batidas de pontos");
        
        let times = pontos.map(ponto => moment(ponto, 'HH:mm:ss'));

        times = times.sort((time1, time2) => {
            return moment.duration(time1.diff(time2)).asSeconds();
        })

        let beforeLunchDuration = moment.duration(times[1].diff(times[0]));

        if(pontos.length/2 !== 2) {
            //Horário registrado até o momento foi somente até o almoço
            this.calculateAttributes(beforeLunchDuration.asSeconds());
            return;
        } 

        //Como o funcionário voltou do almoço, é necessário desfazer as alterações feitas antes do almoço e computar novamente o relatório
        this.doRollbackOfPreviousComputation(beforeLunchDuration)

        const afterLunchDuration = moment.duration(times[3].diff(times[2]));
        const horasTrabalhadasOfDay = beforeLunchDuration.asSeconds() + afterLunchDuration.asSeconds();

        this.calculateAttributes(horasTrabalhadasOfDay);

    }

    private getDaylyWorkingHoursInSeconds() {
        return 8*60*60;
    }

    private doRollbackOfPreviousComputation(duration: moment.Duration){
        this.horasTrabalhadasInSeconds -= duration.asSeconds();

        const partialDurationRate = duration.asSeconds()/this.getDaylyWorkingHoursInSeconds()

        if(partialDurationRate < 1){
            this.horasDevidasInSeconds -= this.getDaylyWorkingHoursInSeconds() - duration.asSeconds();
        } 
    }

    private calculateAttributes(horasTrabalhadasOfDay: number) {
        const completeDurationRate = horasTrabalhadasOfDay/this.getDaylyWorkingHoursInSeconds();

        if(completeDurationRate < 1) this.horasDevidasInSeconds += this.getDaylyWorkingHoursInSeconds() - horasTrabalhadasOfDay;
        else this.horasExcedentesInSeconds += horasTrabalhadasOfDay - this.getDaylyWorkingHoursInSeconds()

        if(this.horasExcedentesInSeconds > 0 && this.horasDevidasInSeconds > 0) {
            const diffHoras = this.horasExcedentesInSeconds - this.horasDevidasInSeconds;

            if(diffHoras > 0) {
                this.horasDevidasInSeconds = 0
                this.horasExcedentesInSeconds = diffHoras;
            } else {
                this.horasExcedentesInSeconds = 0;
                this.horasDevidasInSeconds = Math.abs(diffHoras)
            }
        }

        this.horasTrabalhadasInSeconds += horasTrabalhadasOfDay;
    }
}

export const RelatorioSchema = SchemaFactory.createForClass(Relatorio);