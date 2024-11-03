import { LivroAutorExibicao } from "./livro-autor-exibicao";

export interface ReportLivroAutorExibicao {
    codAu: number,
    nomeAutor: string;
    livrosExibicao: LivroAutorExibicao[];
}