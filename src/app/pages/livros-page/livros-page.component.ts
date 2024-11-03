import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Livro } from '../../models/livro';
import { LivroService } from '../../services/livro.service';
import { NavigationExtras, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-livros-page',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './livros-page.component.html',
  styleUrl: './livros-page.component.css'
})
export class LivrosPageComponent implements OnInit {
  listaLivros: Livro[] = [];

  constructor(private service: LivroService, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.service.livros$.subscribe((result) => {
      this.listaLivros = result;
    });

    this.obterLivros();
  }

  async obterLivros() {
    this.service.obterLivros();
  }

  async deletarLivro(id: number): Promise<void> {
    if (confirm('Deseja excluir este livro?')) {
      await this.service.deletarLivro(id)
        .then(() => {
          this.obterLivros();
          this.toastr.success('Livro deletado com sucesso!');
        })
        .catch(error => {
          this.toastr.error(error.message);
        });
    }
  }

  editarLivro(livro: Livro) {
    this.router.navigate(['/livros/edit'], {
      state: {
        livro: livro,
      }
    });
  }

  redirecionarParaTelaCadastroLivro(livro?: Livro) {
    this.router.navigate(['/livros/create']);
  }
}
