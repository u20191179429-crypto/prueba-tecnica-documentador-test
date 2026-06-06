import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

/**
 * Configuración de rutas de la aplicación.
 * Las rutas protegidas requieren autenticación mediante authGuard.
 */
export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component')
      .then(m => m.LoginComponent),
    title: 'Iniciar Sesión - CITCD'
  },
  {
    path: 'solicitudes',
    loadComponent: () => import('./components/lista-solicitudes/lista-solicitudes.component')
      .then(m => m.ListaSolicitudesComponent),
    canActivate: [authGuard],
    title: 'Lista de Solicitudes - CITCD'
  },
  {
    path: 'solicitudes/nueva',
    loadComponent: () => import('./components/formulario-solicitud/formulario-solicitud.component')
      .then(m => m.FormularioSolicitudComponent),
    canActivate: [authGuard],
    title: 'Nueva Solicitud - CITCD'
  },
  {
    path: 'solicitudes/filtrar',
    loadComponent: () => import('./components/filtrar-solicitudes/filtrar-solicitudes.component')
      .then(m => m.FiltrarSolicitudesComponent),
    canActivate: [authGuard],
    title: 'Filtrar Solicitudes - CITCD'
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
