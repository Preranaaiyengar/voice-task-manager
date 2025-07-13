import { Routes } from '@angular/router';
import { TASK_ROUTES } from './features/tasks';
import { provideRouter } from '@angular/router';
import { ApplicationConfig } from '@angular/core';

export const routes: Routes = [
    { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  {
    path: 'tasks',
    loadChildren: () =>
      import('./features/tasks').then((m) => m.TASK_ROUTES),
  },

  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard').then(m => m.DASHBOARD_ROUTES)
  }
  
];

export const appConfig: ApplicationConfig = {
    providers: [provideRouter(routes)],
  };