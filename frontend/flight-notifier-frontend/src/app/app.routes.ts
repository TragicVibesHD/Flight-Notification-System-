import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { FlightSearch } from './components/flight-search/flight-search';
import { PassengerSelection } from './components/passenger-selection/passenger-selection';
import { SentLog } from './components/sent-log/sent-log';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login, title: 'Login' },
  { path: 'flight-search', component: FlightSearch, canActivate: [authGuard], title: 'Flight Search' },
  { path: 'passengers/:scope', component: PassengerSelection, canActivate: [authGuard], title: 'Passengers' },
  { path: 'dashboard', component: SentLog, canActivate: [authGuard], title: 'Dashboard' },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
