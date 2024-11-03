import { inject, Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { BehaviorSubject } from 'rxjs';
import { Livro } from '../models/livro';
import { LivroSave } from '../models/livro-save';

@Injectable({
  providedIn: 'root',
})

export class LivroService {
  private baseService: BaseService = inject(BaseService);
  private baseUrl = this.baseService.getBaseUrl();
  private livroSubject = new BehaviorSubject<Livro[]>([]);
  livros$ = this.livroSubject.asObservable();

  constructor() { }

  async obterLivros(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}livros`);
      const data = await response.json();
      this.livroSubject.next(data ?? []);
    } catch (error) {
      console.error('Falha ao obter os livros', error);
      this.livroSubject.next([]);
    }
  }

  async salvarLivro(livro: LivroSave) {
    if (livro.codl == 0) {
      await this.criarNovoLivro(livro);
    } else {
      await this.atualizarLivro(livro);
    }
  }

  async criarNovoLivro(livro: LivroSave) {
    await fetch(`${this.baseUrl}livro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(livro)
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

  async atualizarLivro(livro: LivroSave) {
    await fetch(`${this.baseUrl}livro`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(livro)
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

  async deletarLivro(id: number): Promise<void> {
    await fetch(`${this.baseUrl}livro/${id}`, { method: 'DELETE' })
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
