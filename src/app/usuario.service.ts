import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioAutenticado } from './usuario-autenticado.model';
import { Usuario } from './usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl =
    'https://ehj09v655m.execute-api.us-east-1.amazonaws.com/api/usuarios';

  listarUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  obtenerMiPerfil(): Observable<UsuarioAutenticado> {
    return this.http.get<UsuarioAutenticado>(`${this.apiUrl}/me`);
  }
}
