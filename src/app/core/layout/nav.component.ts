import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="nav" [class.nav--open]="open()">
      <!-- Brand always visible -->
      <a routerLink="/" class="nav__brand" aria-label="Home">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 440 80"
          height="28"
          role="img"
          aria-label="Jorge Zumaya"
        >
          <title>jorge.zumaya</title>
          <text
            x="220"
            y="56"
            font-family="'Space Grotesk', 'Inter', system-ui, sans-serif"
            font-weight="700"
            font-size="48"
            letter-spacing="-1"
            text-anchor="middle"
            fill="#FAFAFA"
          >
            jorge
            <tspan fill="#FF3D00">.</tspan>
            zumaya
          </text>
        </svg>
      </a>

      <!-- Desktop: inline links -->
      <ul class="nav__links nav__links--desktop">
        <li><a routerLink="/experience" routerLinkActive="active">Experience</a></li>
        <li><a routerLink="/work" routerLinkActive="active">Work</a></li>
        <li><a routerLink="/gallery" routerLinkActive="active">Gallery</a></li>
        <li>
          <a routerLink="/contact" routerLinkActive="active" class="nav__cta">Contact</a>
        </li>
      </ul>

      <!-- Mobile only: Contact CTA + hamburger -->
      <a
        routerLink="/contact"
        routerLinkActive="active"
        class="nav__cta nav__mobile-cta"
        (click)="close()"
        >Contact</a
      >
      <button
        class="nav__toggle"
        (click)="open.set(!open())"
        [attr.aria-expanded]="open()"
        aria-label="Toggle navigation"
      >
        <span></span><span></span><span></span>
      </button>

      <!-- Mobile collapsible links (in-flow, no fixed/absolute) -->
      <ul class="nav__links nav__links--mobile" [class.is-open]="open()">
        <li>
          <a routerLink="/experience" routerLinkActive="active" (click)="close()">Experience</a>
        </li>
        <li><a routerLink="/work" routerLinkActive="active" (click)="close()">Work</a></li>
        <li>
          <a routerLink="/gallery" routerLinkActive="active" (click)="close()">Gallery</a>
        </li>
      </ul>
    </nav>
  `,
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  open = signal(false);
  private el = inject(ElementRef);

  close(): void {
    this.open.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.open() && !this.el.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }
}
