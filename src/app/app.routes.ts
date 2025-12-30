import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth-guard';
import { Login } from './auth/pages/login/login';
import { Products } from './products/pages/products/products';

export const routes: Routes = [

  { path: 'login', component: Login },
  {
    path: 'products',
    component: Products,
    canActivate: [authGuard],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },

];
