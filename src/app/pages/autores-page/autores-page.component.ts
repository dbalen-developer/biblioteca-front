import { Component, OnInit } from '@angular/core';
import { Autor } from '../../models/autor';
import { AutorService } from '../../services/autor.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CriarAutorComponent } from '../../components/criar-autor/criar-autor.component';

@Component({
  selector: 'app-autores-page',
  standalone: true,
  imports: [CriarAutorComponent],
  templateUrl: './autores-page.component.html',
  styleUrl: './autores-page.component.css'
})
export class AutoresPageComponent implements OnInit {
  listaAutores: Autor[] = [];

  constructor(private service: AutorService, private modalService: NgbModal, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.service.autores$.subscribe((result) => {
      this.listaAutores = result;
    });

    this.obterAutores();
  }

  async obterAutores() {
    this.service.obterAutores();
  }

  async deletarAutor(id: number): Promise<void> {
    if (confirm('Deseja excluir este autor?')) {
      await this.service.deletarAutor(id)
        .then(() => {
          this.obterAutores();
          this.toastr.success('Autor deletado com sucesso!');
        })
        .catch(error => {
          this.toastr.error(error.message);
        });
    }
  }

  editarAutor(autor: Autor){
    this.abrirModalAutor(autor);
  }

  abrirModalAutor(autor?: Autor) {
    const modalRef = this.modalService.open(CriarAutorComponent);
    modalRef.componentInstance.autor = autor;

    modalRef.result.then(
      (result) => {
        this.obterAutores();
      }
    );
  }
}
