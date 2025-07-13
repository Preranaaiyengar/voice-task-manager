export * from './task-card/task-card.component'
export * from './task-form/task-form.component'
export * from './task.page/task.page.component'

import { Route } from '@angular/router';
import { TaskPageComponent } from './task.page/task.page.component';

export const TASK_ROUTES: Route[] = [
  {
    path: '',
    component: TaskPageComponent,
    title: 'Tasks',
  },
];
