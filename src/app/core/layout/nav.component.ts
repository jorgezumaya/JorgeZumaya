import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="nav">
      <a routerLink="/" class="nav__brand" aria-label="Home">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 80" height="28" role="img" aria-label="Jorge Zumaya">
          <title>jorge.zumaya</title>
          <text x="220" y="56" font-family="'Space Grotesk', 'Inter', system-ui, sans-serif" font-weight="700" font-size="48" letter-spacing="-1" text-anchor="middle" fill="#FAFAFA">jorge<tspan fill="#FF3D00">.</tspan>zumaya</text>
        </svg>
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
