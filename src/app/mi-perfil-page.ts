import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { UsuarioAutenticado } from './usuario-autenticado.model';
import { UsuarioService } from './usuario.service';

@Component({
  selector: 'app-mi-perfil-page',
  standalone: true,
  template: `
    <main>
      <section class="profile-card">
        <h1>Mi perfil</h1>

        @if (cargando()) {
          <p class="message" role="status">Cargando perfil...</p>
        } @else if (mensajeError()) {
          <p class="message message--error" role="alert">{{ mensajeError() }}</p>
        } @else if (perfil(); as usuario) {
          <dl>
            <div>
              <dt>Nombre</dt>
              <dd>{{ mostrarValor(usuario.nombre) }}</dd>
            </div>
            <div>
              <dt>Usuario</dt>
              <dd>{{ mostrarValor(usuario.username) }}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{{ mostrarValor(usuario.email) }}</dd>
            </div>
            <div>
              <dt>Object ID</dt>
              <dd>{{ mostrarValor(usuario.objectId) }}</dd>
            </div>
            <div>
              <dt>Tenant ID</dt>
              <dd>{{ mostrarValor(usuario.tenantId) }}</dd>
            </div>
            <div>
              <dt>Scope</dt>
              <dd>{{ mostrarValor(usuario.scope) }}</dd>
            </div>
          </dl>
        }
      </section>
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
      max-width: 48rem;
      margin: 0 auto;
      padding: 4rem 1.5rem;
    }

    .profile-card {
      padding: 2rem;
      border-radius: 0.75rem;
      background: #ffffff;
      box-shadow: 0 0.5rem 1.5rem rgb(15 23 42 / 8%);
    }

    h1 {
      margin: 0 0 1.5rem;
    }

    dl {
      margin: 0;
    }

    dl div {
      display: grid;
      grid-template-columns: minmax(8rem, 11rem) 1fr;
      gap: 1rem;
      padding: 0.85rem 0;
      border-bottom: 1px solid #e5e7eb;
    }

    dl div:last-child {
      border-bottom: 0;
    }

    dt {
      font-weight: 700;
    }

    dd {
      margin: 0;
      overflow-wrap: anywhere;
    }

    .message {
      margin: 0;
      padding: 1rem;
      border-radius: 0.5rem;
      background: #f8fafc;
    }

    .message--error {
      color: #b91c1c;
      background: #fef2f2;
    }
  `,
})
export class MiPerfilPage implements OnInit {
  private readonly usuarioService = inject(UsuarioService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly perfil = signal<UsuarioAutenticado | null>(null);
  protected readonly cargando = signal(true);
  protected readonly mensajeError = signal<string | null>(null);

  ngOnInit(): void {
    this.usuarioService
      .obtenerMiPerfil()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.cargando.set(false)),
      )
      .subscribe({
        next: (perfil) => this.perfil.set(perfil),
        error: (error) => {
          console.error('Error al cargar el perfil autenticado:', error);
          this.mensajeError.set(
            'No fue posible cargar tu perfil. Verifica que Usuarios Service esté disponible.',
          );
        },
      });
  }

  protected mostrarValor(valor: string | null): string {
    return valor?.trim() || 'No disponible';
  }
}
