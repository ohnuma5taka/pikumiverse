import { SandboxComponent } from '@/app/components/pages/sandbox/sandbox.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'sandbox',
    title: 'sandbox',
    component: SandboxComponent,
  },
  { path: '**', redirectTo: 'sandbox' },
];
