import { Component } from '@angular/core';
import { Autor } from '../../models/autor';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutorService } from '../../services/autor.service';
import { ToastrService } from 'ngx-toastr';
import { Assunto } from '../../models/assunto';
import { AssuntoService } from '../../services/assunto.service';
import { FormaCompra } from '../../models/forma-compra';
import { FormaCompraService } from '../../services/forma-compra.service';
import { LivroFormaCompra } from '../../models/livro-forma-compra';
import { Livro } from '../../models/livro';
import { LivroSave } from '../../models/livro-save';
import { LivroService } from '../../services/livro.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-criar-livro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './criar-livro.component.html',
  styleUrl: './criar-livro.component.css',
})
export class CriarLivroComponent {
  livroForm: FormGroup;
  livro?: Livro;

  listaAutores: Autor[] = [];
  listaAssuntos: Assunto[] = [];
  listaFormasCompra: FormaCompra[] = [];

  listaLivroFormasCompra: LivroFormaCompra[] = [];

  listaAutoresAdicionados: Autor[] = [];
  listaAssuntosAdicionados: Assunto[] = [];

  constructor(
    private fb: FormBuilder,
    private assuntoService: AssuntoService,
    private autorService: AutorService,
    private service: LivroService,
    private formaCompraService: FormaCompraService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.livroForm = this.fb.group({
      codl: [0],
      titulo: [''],
      editora: [''],
      edicao: [0],
      anoPublicacao: [0],
    });

    this.popularListaAssuntos();
    this.popularListaAutores();
    this.popularFormasDeCompra();

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.livro = navigation.extras.state['livro'];
    }
  }

  ngOnInit() {
    this.livroForm = this.fb.group({
      codl: [0],
      titulo: ['', [Validators.required, Validators.maxLength(40)]],
      editora: ['', [Validators.required, Validators.maxLength(40)]],
      edicao: [0, [Validators.required, Validators.min(1), Validators.max(9999)]],
      anoPublicacao: [0, [Validators.required, Validators.pattern(/^[1-9]\d{3}$/)]],
    });

    if (this.livro) {
      this.livroForm.patchValue(this.livro);

      this.listaAutoresAdicionados = this.livro.autores;
      this.listaAssuntosAdicionados = this.livro.assuntos;
      this.listaLivroFormasCompra = this.livro.formasCompra;
    }
  }

  async popularListaAssuntos() {
    const response: Assunto[] = await this.assuntoService.getAssuntos();
    this.listaAssuntos = response;
  }

  async popularListaAutores() {
    const response: Autor[] = await this.autorService.getAutoress();
    this.listaAutores = response;
  }

  async popularFormasDeCompra() {
    this.listaFormasCompra = await this.formaCompraService.getFormas();

    const codigosExistentes = new Set(this.listaLivroFormasCompra.map(x => x.codFo));

    this.listaFormasCompra.forEach(f => {
      if (!codigosExistentes.has(f.codFo)) {

        const forma: LivroFormaCompra = {
          codFo: f.codFo,
          descricao: f.descricao,
          preco: 0
        };

        this.listaLivroFormasCompra.push(forma);
      }
    });
  }

  adicionarAutor(selectElement: HTMLSelectElement) {
    const selectedAutorId = parseInt(selectElement.value, 10);

    const autor = this.listaAutores.find(a => a.codAu === selectedAutorId);

    // Verifica se o autor existe e ainda não foi adicionado
    if (autor && !this.listaAutoresAdicionados.some(a => a.codAu === selectedAutorId)) {
      this.listaAutoresAdicionados.push(autor);
    }
  }

  removerAutor(autor: Autor) {
    const index = this.listaAutoresAdicionados.findIndex(a => a.codAu === autor.codAu);

    if (index !== -1) {
      this.listaAutoresAdicionados.splice(index, 1);
    }
  }

  adicionarAssunto(selectElement: HTMLSelectElement) {
    const selectedAssuntoId = parseInt(selectElement.value, 10);

    const assunto = this.listaAssuntos.find(a => a.codAs === selectedAssuntoId);

    // Verifica se o assunto existe e ainda não foi adicionado
    if (assunto && !this.listaAssuntosAdicionados.some(a => a.codAs === selectedAssuntoId)) {
      this.listaAssuntosAdicionados.push(assunto);
    }
  }

  removerAssunto(assunto: Assunto) {
    const index = this.listaAssuntosAdicionados.findIndex(a => a.codAs === assunto.codAs);

    if (index !== -1) {
      this.listaAssuntosAdicionados.splice(index, 1);
    }
  }

  formatPreco(preco: number): string {
    return preco.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  onPrecoBlur(item: LivroFormaCompra, event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    let rawValue = inputElement.value
      .replace(/[^0-9.,]/g, '')
      .replace(/[.]/g, '')
      .replace(/[,]/g, '.');

    rawValue = rawValue === '' ? '0' : rawValue;
    const parsedValue = parseFloat(rawValue);

    if (!isNaN(parsedValue)) {
      item.preco = parsedValue;
    }

    if (item.preco > 9999999999999999)
      item.preco = 0;

    inputElement.value = this.formatPreco(item.preco);
  }

  async salvarLivro() {
    if (this.livroForm.valid) {
      if (this.listaAutoresAdicionados.length === 0) {
        this.toastr.warning('Nenhum autor adicionado!');
        return;
      }

      if (this.listaAssuntosAdicionados.length === 0) {
        this.toastr.warning('Nenhum assunto adicionado!');
        return;
      }

      const formasCompras = this.listaLivroFormasCompra.map(item => ({
        codFo: item.codFo,
        preco: item.preco,
        descricao: ''
      }));

      const novoLivro: LivroSave = {
        codl: this.livro?.codl ?? 0,
        titulo: this.livroForm.value.titulo,
        editora: this.livroForm.value.editora,
        edicao: this.livroForm.value.edicao,
        anoPublicacao: this.livroForm.value.anoPublicacao.toString(),
        assuntosIds: this.listaAssuntosAdicionados.map(x => x.codAs),
        autoresIds: this.listaAutoresAdicionados.map(x => x.codAu),
        formasCompras: formasCompras,
      };

      await this.service.salvarLivro(novoLivro)
        .then(() => {
          if (novoLivro.codl == 0)
            this.toastr.success('Livro adicionado com sucesso!');
          else
            this.toastr.info('Livro atualizado com sucesso!');

          this.router.navigate(['/livros']);
        })
        .catch(error => {
          this.toastr.error(error.message);
        });
    } else {
      this.livroForm.markAllAsTouched();
    }
  }
}
