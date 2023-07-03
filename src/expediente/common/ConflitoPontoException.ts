
export class ConflitoPontoException extends Error{
    constructor(public desc: {mensagem: string}) {
        super();
    }
}