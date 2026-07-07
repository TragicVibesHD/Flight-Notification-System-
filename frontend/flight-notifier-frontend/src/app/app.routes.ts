import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Portal } from './components/portal/portal';
import { SentLog } from './components/sent-log/sent-log';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'portal', component: Portal, canActivate: [authGuard] },
  { path: 'sent-log', component: SentLog, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];