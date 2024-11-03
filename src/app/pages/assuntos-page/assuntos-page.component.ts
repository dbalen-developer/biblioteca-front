import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Assunto } from '../../models/assunto';
import { CriarAssuntoComponent } from '../../components/criar-assunto/criar-assunto.component';
import { AssuntoService } from '../../services/assunto.service';

@Component({
  selector: 'app-assuntos-page',
  standalone: true,
  imports: [CriarAssuntoComponent],
  templateUrl: './assuntos-page.component.html',
  styleUrl: './assuntos-page.component.css'
})
export class AssuntosPageComponent implements OnInit {
  listaAssuntos: Assunto[] = [];

  constructor(private service: AssuntoService, private modalService: NgbModal, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.service.assuntos$.subscribe((result) => {
      this.listaAssuntos = result;
    });

    this.obterAssuntos();
  }

  async obterAssuntos() {
    this.service.obterAssuntos();
  }

  async deletarAssunto(id: number): Promise<void> {
    if (confirm('Deseja excluir este Assunto?')) {
      await this.service.deletarAssunto(id)
        .then(() => {
          this.obterAssuntos();
          this.toastr.success('Assunto deletado com sucesso!');
        })
        .catch(error => {
          this.toastr.error(error.message);
        });
    }
  }

  editarAssunto(Assunto: Assunto){
    this.abrirModalAssunto(Assunto);
  }

  abrirModalAssunto(assunto?: Assunto) {
    const modalRef = this.modalService.open(CriarAssuntoComponent);
    modalRef.componentInstance.assunto = assunto;

    modalRef.result.then(
      (result) => {
        this.obterAssuntos();
      }
    );
  }
}
