import { Component, input } from '@angular/core';
import { Project } from './projects.data';

@Component({
  selector: 'app-project-card',
  standalone: true,
  template: `
    <article
      class="card"
      (mousemove)="onTilt($event)"
      (mouseleave)="resetTilt($event)"
    >
      <div class="card__cover" aria-hidden="true">
        <span class="card__slug">{{ project().slug }}</span>
      </div>
      <div class="card__body">
        <h3 class="card__title">{{ project().title }}</h3>
        <p class="card__desc">{{ project().description }}</p>
        <ul class="card__stack">
          @for (tag of project().stack; track tag) {
            <li class="chip">{{ tag }}</li>
          }
        </ul>
        @if (project().link) {
          <a
            [href]="project().link"
            target="_blank"
            rel="noopener"
            class="card__link"
          >View project ↗</a>
        }
      </div>
    </article>
  `,
  styles: [
    `
      .card {
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        overflow: hidden;
        transition:
          border-color var(--dur-fast) var(--ease-out),
          box-shadow var(--dur-fast) var(--ease-out);
        will-change: transform;
        display: flex;
        flex-direction: column;

        &:hover {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 1px var(--color-accent);
        }
      }

      .card__cover {
        aspect-ratio: 16 / 9;
        background: var(--color-surface-2);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .card__slug {
        font-family: var(--font-mono);
        font-size: 0.7rem;
        color: var(--color-text-mute);
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      .card__body {
        padding: var(--space-6);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        flex: 1;
      }

      .card__title {
        font-family: var(--font-display);
        font-size: 1.2rem;
        font-weight: 600;
        letter-spacing: -0.02em;
      }

      .card__desc {
        color: var(--color-text-mute);
        font-size: 0.9rem;
        line-height: 1.65;
        flex: 1;
      }

      .card__stack {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
        list-style: none;
        margin-top: var(--space-2);
      }

      .chip {
        font-family: var(--font-mono);
        font-size: 0.68rem;
        padding: 2px var(--space-2);
        background: var(--color-surface-2);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        letter-spacing: 0.05em;
        transition:
          border-color var(--dur-fast) var(--ease-out),
          color var(--dur-fast) var(--ease-out);

        &:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
        }
      }

      .card__link {
        font-family: var(--font-mono);
        font-size: 0.78rem;
        color: var(--color-accent);
        letter-spacing: 0.05em;
        margin-top: var(--space-2);
        transition: opacity var(--dur-fast) var(--ease-out);

        &:hover {
          opacity: 0.7;
        }
      }
    `,
  ],
})
export class ProjectCardComponent {
  project = input.required<Project>();

  onTilt(e: MouseEvent): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    card.style.transform = `perspective(700px) rotateX(${y}deg) rotateY(${x}deg)`;
  }

  resetTilt(e: MouseEvent): void {
    (e.currentTarget as HTMLElement).style.transform = '';
  }
}
