import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { Usuario } from './usuario.model';
import { UsuarioService } from './usuario.service';

@Component({
  selector: 'app-usuarios-page',
  standalone: true,
  template: `
    <main>
      <h1>Usuarios de Pedidos360</h1>
      <p class="description">Esta ruta protegida consume Usuarios Service.</p>

      @if (cargando()) {
        <p class="message" role="status">Cargando usuarios...</p>
      } @else if (mensajeError()) {
        <p class="message message--error" role="alert">{{ mensajeError() }}</p>
      } @else if (usuarios().length === 0) {
        <p class="message">No hay usuarios disponibles.</p>
      } @else {
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Activo</th>
              </tr>
            </thead>
            <tbody>
              @for (usuario of usuarios(); track usuario.id) {
                <tr>
                  <td>{{ usuario.id }}</td>
                  <td>{{ usuario.nombre }}</td>
                  <td>{{ usuario.email }}</td>
                  <td>{{ usuario.telefono }}</td>
                  <td>{{ usuario.direccion }}</td>
                  <td>{{ usuario.activo ? 'Sí' : 'No' }}</td>
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
export class UsuariosPage implements OnInit {
  private readonly usuarioService = inject(UsuarioService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly usuarios = signal<Usuario[]>([]);
  protected readonly cargando = signal(true);
  protected readonly mensajeError = signal<string | null>(null);

  ngOnInit(): void {
    this.usuarioService
      .listarUsuarios()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.cargando.set(false)),
      )
      .subscribe({
        next: (usuarios) => this.usuarios.set(usuarios),
        error: (error) => {
          console.error('Error al cargar los usuarios:', error);
          this.mensajeError.set(
            'No fue posible cargar los usuarios. Verifica que Usuarios Service esté disponible.',
          );
        },
      });
  }
}
