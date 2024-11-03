import { inject, Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { FormaCompra } from '../models/forma-compra';

@Injectable({
  providedIn: 'root',
})

export class FormaCompraService {
  private baseService: BaseService = inject(BaseService);
  private baseUrl = this.baseService.getBaseUrl();

  constructor() { }

  async getFormas(): Promise<FormaCompra[]> {
    try {
      const response = await fetch(`${this.baseUrl}formas-de-compras`);
      const data = await response.json();
      return data as FormaCompra[];
    } catch (error) {
      return [];
    }
  }
}
