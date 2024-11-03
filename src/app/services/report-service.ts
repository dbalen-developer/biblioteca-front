import { inject, Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { ReportLivroAutor } from '../models/report-livro-autor';

@Injectable({
  providedIn: 'root',
})

export class ReportService {
  private baseService: BaseService = inject(BaseService);
  private baseUrl = this.baseService.getBaseUrl();

  constructor() { }

  async getReportLivroPorAutor(): Promise<ReportLivroAutor[]> {
    try {
      const response = await fetch(`${this.baseUrl}report/livros-por-autor`);
      const data = await response.json();
      return data as ReportLivroAutor[];
    } catch (error) {
      return [];
    }
  }
}
