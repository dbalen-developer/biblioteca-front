import { FormaCompra } from "./forma-compra";
import { LivroFormaCompra } from "./livro-forma-compra";

export interface LivroSave {
    codl : number,
    titulo: string,
    editora: string,
    edicao: number,
    anoPublicacao: string,
    assuntosIds: number[],
    autoresIds: number[],
    formasCompras: LivroFormaCompra[]
}
