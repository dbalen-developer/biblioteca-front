import { inject, Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { BehaviorSubject } from 'rxjs';
import { Autor } from '../models/autor';

@Injectable({
  providedIn: 'root',
})

export class AutorService {
  private baseService: BaseService = inject(BaseService);
  private baseUrl = this.baseService.getBaseUrl();
  private autorSubject = new BehaviorSubject<Autor[]>([]);
  autores$ = this.autorSubject.asObservable();

  constructor() { }

  async obterAutores(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}autores`);
      const data = await response.json();
      this.autorSubject.next(data ?? []);
    } catch (error) {
      this.autorSubject.next([]);
    }
  }

  async getAutoress(): Promise<Autor[]> {
    try {
      const response = await fetch(`${this.baseUrl}autores`);
      const data = await response.json();
      return data as Autor[];
    } catch (error) {
      return [];
    }
  }

  async salvarAutor(autor: Autor) {
    if (autor.codAu == 0) {
      await this.criarNovoAutor(autor.nome);
    } else {
      await this.atualizarAutor(autor);
    }

    await this.obterAutores();
  }

  async criarNovoAutor(nome: String) {
    await fetch(`${this.baseUrl}autor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome })
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

  async atualizarAutor(autor: Autor) {
    try {
      await fetch(`${this.baseUrl}autor`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(autor),
      });

    } catch (error) {
      console.error('Falha ao atualizar o autor', error);
    }
  }

  async deletarAutor(id: number): Promise<void> {
    await fetch(`${this.baseUrl}autor/${id}`, { method: 'DELETE' })
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
