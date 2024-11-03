import { Component } from '@angular/core';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AssuntoService } from '../../services/assunto.service';
import { Assunto } from '../../models/assunto';

@Component({
  selector: 'app-criar-assunto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule],
  templateUrl: './criar-assunto.component.html',
  styleUrl: './criar-assunto.component.css',
})
export class CriarAssuntoComponent {
  assuntoForm: FormGroup;
  assunto?: Assunto;

  constructor(
    public modalRef: NgbActiveModal,
    private fb: FormBuilder,
    private service: AssuntoService,
    private toastr: ToastrService
  ) {
    this.assuntoForm = this.fb.group({
      descricao: [''],
    });
  }

  ngOnInit(): void {
    this.assuntoForm = this.fb.group({
      descricao: ['', [Validators.required, Validators.maxLength(20)]],
    });

    if (this.assunto) {
      this.assuntoForm.patchValue(this.assunto);
    }
  }

  salvarAssunto() {
    if (this.assuntoForm.valid) {

      const novoAssunto: Assunto = {
        codAs: this.assunto?.codAs ?? 0,
        descricao: this.assuntoForm.value.descricao ?? '',
      };

      this.service.salvarAssunto(novoAssunto);
      this.modalRef.close(novoAssunto);

      if (novoAssunto.codAs == 0)
        this.toastr.success('Assunto adicionado com sucesso!');
      else
        this.toastr.info('Assunto atualizado com sucesso!');
    }
  }
}
