import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { Pedido } from './pedido.model';
import { PedidoService } from './pedido.service';

@Component({
  selector: 'app-pedidos-page',
  standalone: true,
  template: `
    <main>
      <h1>Área protegida de Pedidos360</h1>
      <p class="description">El usuario tuvo que autenticarse para acceder a esta ruta.</p>

      @if (cargando()) {
        <p class="message" role="status">Cargando pedidos...</p>
      } @else if (mensajeError()) {
        <p class="message message--error" role="alert">{{ mensajeError() }}</p>
      } @else if (pedidos().length === 0) {
        <p class="message">No hay pedidos disponibles.</p>
      } @else {
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Estado</th>
                <th>Dirección de entrega</th>
              </tr>
            </thead>
            <tbody>
              @for (pedido of pedidos(); track pedido.id) {
                <tr>
                  <td>{{ pedido.id }}</td>
                  <td>{{ pedido.cliente }}</td>
                  <td>{{ pedido.producto }}</td>
                  <td>{{ pedido.cantidad }}</td>
                  <td>{{ pedido.estado }}</td>
                  <td>{{ pedido.direccionEntrega }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </main>
  `,
  styles: `
    :host {
      display: block;
      min-height: 100vh;
      font-family: Arial, sans-serif;
      color: #1f2937;
      background: #f3f4f6;
    }

    main {
      max-width: 72rem;
      margin: 0 auto;
      padding: 4rem 1.5rem;
    }

    h1 {
      margin: 0;
    }

    .description {
      margin: 0.75rem 0 2rem;
    }

    .message {
      padding: 1rem;
      border-radius: 0.5rem;
      background: #ffffff;
    }

    .message--error {
      color: #b91c1c;
      background: #fef2f2;
    }

    .table-container {
      overflow-x: auto;
      border-radius: 0.5rem;
      background: #ffffff;
      box-shadow: 0 0.5rem 1.5rem rgb(15 23 42 / 8%);
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th,
    td {
      padding: 0.9rem 1rem;
      border-bottom: 1px solid #e5e7eb;
      text-align: left;
      white-space: nowrap;
    }

    th {
      color: #374151;
      background: #f8fafc;
    }

    tbody tr:last-child td {
      border-bottom: 0;
    }
  `,
})
export class PedidosPage implements OnInit {
  private readonly pedidoService = inject(PedidoService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly pedidos = signal<Pedido[]>([]);
  protected readonly cargando = signal(true);
  protected readonly mensajeError = signal<string | null>(null);

  ngOnInit(): void {
    this.pedidoService
      .listarTodos()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.cargando.set(false)),
      )
      .subscribe({
        next: (pedidos) => this.pedidos.set(pedidos),
        error: (error) => {
          console.error('Error al cargar los pedidos:', error);
          this.mensajeError.set(
            'No fue posible cargar los pedidos. Verifica que el backend esté disponible.',
          );
        },
      });
  }
}
