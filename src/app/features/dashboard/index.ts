import { Route } from '@angular/router';
import { DashboardPageComponent } from './dashboard-page.component';

export const DASHBOARD_ROUTES: Route[] = [
  {
    path: '',
    component: DashboardPageComponent,
    title: 'Dashboard',
  },
];
