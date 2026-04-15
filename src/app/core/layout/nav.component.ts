import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="nav">
      <a routerLink="/" class="nav__brand" aria-label="Home">
        <img src="/assets/logo/logo-nav.svg" alt="jorge.zumaya" height="28" />
      </a>
      <button class="nav__toggle" (click)="open.set(!open())" [attr.aria-expanded]="open()">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav__links" [class.is-open]="open()">
        <li><a routerLink="/experience" routerLinkActive="active" (click)="open.set(false)">Experience</a></li>
        <li><a routerLink="/work" routerLinkActive="active" (click)="open.set(false)">Work</a></li>
        <li><a routerLink="/gallery" routerLinkActive="active" (click)="open.set(false)">Gallery</a></li>
        <li><a routerLink="/contact" routerLinkActive="active" (click)="open.set(false)" class="nav__cta">Contact</a></li>
      </ul>
    </nav>
  `,
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  open = signal(false);
}
