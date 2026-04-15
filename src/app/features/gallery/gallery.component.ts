import { Component, inject, OnInit } from '@angular/core';
import { GalleryService } from '../../core/services/gallery.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  template: `
    <section class="page">
      <h1>Gallery</h1>
      @if (svc.loading()) {
        <p>Loading…</p>
      } @else {
        <div class="grid">
          @for (p of svc.photos(); track p.id) {
            <figure class="tile">
              <img [src]="p.thumbUrl" [alt]="p.caption" loading="lazy" />
            </figure>
          }
        </div>
      }
    </section>
  `,
  styles: [`
    .page { max-width: var(--container-max); margin: 0 auto; padding: var(--space-16) var(--container-pad); }
    h1 { font-family: var(--font-display); font-size: clamp(2.5rem, 6vw, 5rem); letter-spacing: -0.03em; margin-bottom: var(--space-8); }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2px; }
    .tile { aspect-ratio: 1; background: var(--color-surface); overflow: hidden; }
    .tile img { width: 100%; height: 100%; object-fit: cover; transition: transform 400ms var(--ease-out); }
    .tile:hover img { transform: scale(1.05); }
  `],
})
export class GalleryComponent implements OnInit {
  svc = inject(GalleryService);
  ngOnInit() { this.svc.load(); }
}
