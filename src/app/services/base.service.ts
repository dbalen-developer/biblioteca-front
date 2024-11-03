import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  private readonly url = 'https://localhost:7267/';

  getBaseUrl(): string {
    return this.url;
  }

  constructor() { }
}
