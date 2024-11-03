import { Assunto } from "./assunto";
import { Autor } from "./autor";
import { LivroFormaCompra } from "./livro-forma-compra";

export interface Livro {
    codl: number,
    titulo: string,
    editora: string,
    edicao: number,
    anoPublicacao: string,
    assuntos: Assunto[],
    autores: Autor[],
    formasCompra: LivroFormaCompra[]
}