import { Component } from '@angular/core';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Autor } from '../../models/autor';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutorService } from '../../services/autor.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-criar-autor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule],
  templateUrl: './criar-autor.component.html',
  styleUrl: './criar-autor.component.css',
})
export class CriarAutorComponent {
  autorForm: FormGroup;
  autor?: Autor;

  constructor(
    public modalRef: NgbActiveModal,
    private fb: FormBuilder,
    private service: AutorService,
    private toastr: ToastrService
  ) {
    this.autorForm = this.fb.group({
      nome: [''],
    });
  }

  ngOnInit(): void {
    this.autorForm = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(40)]],
    });

    if (this.autor) {
      this.autorForm.patchValue(this.autor);
    }
  }

  salvarAutor() {
    if (this.autorForm.valid) {

      const novoAutor: Autor = {
        codAu: this.autor?.codAu ?? 0,
        nome: this.autorForm.value.nome ?? '',
      };

      this.service.salvarAutor(novoAutor);
      this.modalRef.close(novoAutor);

      if (novoAutor.codAu == 0)
        this.toastr.success('Autor adicionado com sucesso!');
      else
        this.toastr.info('Autor atualizado com sucesso!');
    }
  }
}
