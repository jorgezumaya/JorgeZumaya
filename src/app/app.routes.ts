import { Routes } from '@angular/router';
import { ShellComponent } from './core/layout/shell.component';
import { ROUTE_PATHS } from './app.route-paths';

export const routes: Routes = [
  {
    path: ROUTE_PATHS.prospects,
    loadComponent: () =>
      import('./features/prospects/prospects.component').then((m) => m.ProspectsComponent),
    title: 'JORGE | Websites That Win Customers | Sitios web que ganan clientes',
  },
  {
    path: ROUTE_PATHS.resume,
    loadComponent: () =>
      import('./features/resume/resume.component').then((m) => m.ResumeComponent),
    title: 'Jorge Zumaya Resume',
  },
  {
    path: ROUTE_PATHS.home,
    component: ShellComponent,
    children: [
      {
        path: ROUTE_PATHS.home,
        loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
        title: 'Jorge Zumaya — Full Stack Engineer',
      },
      {
        path: ROUTE_PATHS.experience,
        loadComponent: () =>
          import('./features/experience/experience.component').then((m) => m.ExperienceComponent),
        title: 'Experience · Jorge Zumaya',
      },
      {
        path: ROUTE_PATHS.work,
        loadComponent: () => import('./features/work/work.component').then((m) => m.WorkComponent),
        title: 'Work · Jorge Zumaya',
      },
      {
        path: ROUTE_PATHS.gallery,
        loadComponent: () =>
          import('./features/gallery/gallery.component').then((m) => m.GalleryComponent),
        title: 'Gallery · Jorge Zumaya',
      },
      {
        path: ROUTE_PATHS.contact,
        loadComponent: () =>
          import('./features/contact/contact.component').then((m) => m.ContactComponent),
        title: 'Contact · Jorge Zumaya',
      },
      { path: '**', redirectTo: ROUTE_PATHS.home },
    ],
  },
];
