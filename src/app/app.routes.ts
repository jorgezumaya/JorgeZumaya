import { Routes } from '@angular/router';
import { ShellComponent } from './core/layout/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
        title: 'Jorge Zumaya — Full Stack Engineer',
      },
      {
        path: 'experience',
        loadComponent: () => import('./features/experience/experience.component').then(m => m.ExperienceComponent),
        title: 'Experience · Jorge Zumaya',
      },
      {
        path: 'work',
        loadComponent: () => import('./features/work/work.component').then(m => m.WorkComponent),
        title: 'Work · Jorge Zumaya',
      },
      {
        path: 'gallery',
        loadComponent: () => import('./features/gallery/gallery.component').then(m => m.GalleryComponent),
        title: 'Gallery · Jorge Zumaya',
      },
      {
        path: 'contact',
        loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent),
        title: 'Contact · Jorge Zumaya',
      },
      { path: '**', redirectTo: '' },
    ],
  },
];
