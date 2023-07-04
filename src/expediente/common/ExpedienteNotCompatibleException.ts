
export class ExpedienteNotCompatibleException extends Error{
    constructor(desc: any) {
        super(desc);
    }
}