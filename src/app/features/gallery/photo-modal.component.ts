import { Component, HostListener, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Photo } from '../../core/services/gallery.service';

@Component({
  selector: 'app-photo-modal',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div
      class="overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      (click)="close.emit()"
    >
      <button class="close-btn" aria-label="Close photo viewer" (click)="close.emit()">✕</button>
      <figure class="modal" (click)="$event.stopPropagation()">
        <img [src]="photo().url || photo().thumbUrl" [alt]="photo().caption" loading="eager" />
        <figcaption class="modal__caption">
          <p class="modal__caption-text">{{ photo().caption }}</p>
          <p class="modal__caption-date">{{ photo().takenAt | date: 'MMMM d, y' }}</p>
        </figcaption>
      </figure>
    </div>
  `,
  styles: [
    `
      .overlay {
        position: fixed;
        inset: 0;
        z-index: 200;
        background: rgba(0, 0, 0, 0.92);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--space-8) var(--space-4);
        animation: overlay-in var(--dur) var(--ease-out) both;
      }

      @keyframes overlay-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .overlay {
          animation: none;
        }
      }

      .close-btn {
        position: fixed;
        top: var(--space-6);
        right: var(--space-6);
        font-size: 1.25rem;
        color: var(--color-text-mute);
        z-index: 201;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition:
          color var(--dur-fast) var(--ease-out),
          background var(--dur-fast) var(--ease-out);

        &:hover {
          color: var(--color-text);
          background: var(--color-surface);
        }
      }

      .modal {
        max-width: min(90vw, 960px);
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        animation: modal-in var(--dur) var(--ease-out) both;
      }

      @keyframes modal-in {
        from {
          transform: scale(0.96);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .modal {
          animation: none;
        }
      }

      img {
        max-height: 80vh;
        width: auto;
        max-width: 100%;
        object-fit: contain;
        border-radius: var(--radius-md);
        display: block;
      }

      .modal__caption {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--space-6);
        flex-wrap: wrap;
      }

      .modal__caption-text {
        font-family: var(--font-body);
        font-style: italic;
        font-size: 0.9rem;
        color: var(--color-text);
      }

      .modal__caption-date {
        font-family: var(--font-mono);
        font-size: 0.78rem;
        color: var(--color-text-mute);
        white-space: nowrap;
      }
    `,
  ],
})
export class PhotoModalComponent {
  photo = input.required<Photo>();
  close = output<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close.emit();
  }
}
