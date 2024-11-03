import { inject, Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { BehaviorSubject } from 'rxjs';
import { Assunto } from '../models/assunto';

@Injectable({
  providedIn: 'root',
})

export class AssuntoService {
  private baseService: BaseService = inject(BaseService);
  private baseUrl = this.baseService.getBaseUrl();
  private assuntoSubject = new BehaviorSubject<Assunto[]>([]);
  assuntos$ = this.assuntoSubject.asObservable();

  constructor() { }

  async obterAssuntos(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}assuntos`);
      const data = await response.json();
      this.assuntoSubject.next(data ?? []);
    } catch (error) {
      this.assuntoSubject.next([]);
    }
  }

  async getAssuntos(): Promise<Assunto[]> {
    try {
      const response = await fetch(`${this.baseUrl}assuntos`);
      const data = await response.json();
      return data as Assunto[];
    } catch (error) {
      return [];
    }
  }

  async salvarAssunto(assunto: Assunto) {
    if (assunto.codAs == 0) {
      await this.criarNovoAssunto(assunto.descricao);
    } else {
      await this.atualizarAssunto(assunto);
    }

    await this.obterAssuntos();
  }

  async criarNovoAssunto(descricao: String) {
    await fetch(`${this.baseUrl}assunto`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ descricao })
    }).then(response => {
      if (!response.ok) {
        return response.json().then(errorData => {
          const errorMessages = errorData.errors || [errorData.message || 'Erro desconhecido'];
          throw new Error(errorMessages.join(', '));
        });
      }
      return;
    })
  }

  async atualizarAssunto(Assunto: Assunto) {
    try {
      await fetch(`${this.baseUrl}assunto`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Assunto),
      });

    } catch (error) {
      console.error('Falha ao atualizar o assunto', error);
    }
  }

  async deletarAssunto(id: number): Promise<void> {
    await fetch(`${this.baseUrl}assunto/${id}`, { method: 'DELETE' })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errorData => {
            const errorMessages = errorData.errors || [errorData.message || 'Erro desconhecido'];
            throw new Error(errorMessages.join(', '));
          });
        }
        return response;
      })
  }
}
