import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido } from './pedido.model';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl =
    'https://ehj09v655m.execute-api.us-east-1.amazonaws.com/api/pedidos';

  listarTodos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.apiUrl);
  }
}
