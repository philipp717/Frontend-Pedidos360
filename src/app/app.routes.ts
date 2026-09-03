import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { AuthPage } from './auth-page';
import { PedidosPage } from './pedidos-page';

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
    path: '**',
    redirectTo: '',
  },
];
