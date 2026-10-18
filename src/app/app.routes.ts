import { Routes } from '@angular/router';
import { Home } from './pages/home';

export const routes: Routes = [
  { path: '', component: Home, data: { lang: 'ru' } },
  { path: 'en', component: Home, data: { lang: 'en' } },
  { path: '**', redirectTo: '' },
];
