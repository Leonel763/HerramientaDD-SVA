import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { Dashboard } from './shared/dashboard/dashboard';
import { CambiarPassword } from './pages/auth/cambiar-password/cambiar-password';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'cambiar-password', component: CambiarPassword },
  { path: 'dashboard', component: Dashboard },
  { path: '**', redirectTo: 'login' }
];
