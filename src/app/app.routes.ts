import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { AuthPage } from './auth-page';
import { MiPerfilPage } from './mi-perfil-page';
import { PedidosPage } from './pedidos-page';
import { UsuariosPage } from './usuarios-page';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: AuthPage,
  },
  {
    path: 'pedidos',
    component: PedidosPage,
    canActivate: [MsalGuard],
  },
  {
    path: 'usuarios',
    component: UsuariosPage,
    canActivate: [MsalGuard],
  },
  {
    path: 'mi-perfil',
    component: MiPerfilPage,
    canActivate: [MsalGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
