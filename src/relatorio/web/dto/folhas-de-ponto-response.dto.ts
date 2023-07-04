import * as  moment from "moment";

interface IExpediente {
    dia:string;
    pontos: string[];
}

export class FolhasPontoResponseDto {

    constructor(mes: string,
        horasTrabalhadas: string,    
        horasExcedentes: string,    
        horasDevidas: string,    
        expedientes: IExpediente[])
    {
        this.mes = mes;
        this.horasTrabalhadas = horasTrabalhadas;
        this.horasExcedentes = horasExcedentes;
        this.horasDevidas = horasDevidas;
        this.expedientes = expedientes;
    }

    mes: string;

    horasTrabalhadas: string;

    horasExcedentes: string;

    horasDevidas: string;

    expedientes: IExpediente[];

    static get Builder() {
        class Builder {

            mes: string;

            horasTrabalhadas: string;
        
            horasExcedentes: string;
        
            horasDevidas: string;
        
            expedientes: IExpediente[];

            withHorasTrabalhadasFromNSeconds(seconds: number) : Builder {
                this.horasTrabalhadas = this._formatSeconds(seconds);
                return this;
            }
        
            withHorasDevidasFromNSeconds(seconds: number) : Builder {
                this.horasDevidas = this._formatSeconds(seconds);
                return this;
            }
        
            withHorasExcedentesFromNSeconds(seconds: number) : Builder {
                this.horasExcedentes = this._formatSeconds(seconds);
                return this;
            }

            withExpedientes(expedientes: IExpediente[] ) : Builder {
                this.expedientes = expedientes;
                return this;
            }

            withMes(mes: string ) : Builder {
                this.mes = mes;
                return this;
            }

            build() : FolhasPontoResponseDto {
                return new FolhasPontoResponseDto(this.mes, this.horasTrabalhadas, this.horasExcedentes, this.horasDevidas, this.expedientes);
            }

            _formatSeconds(seconds: number){
                const formatted = moment().startOf('day').seconds(seconds).format("[PT]HH[H]mm[M]ss[S]")
                return formatted;
            }
        }
        return new Builder();
    }
}