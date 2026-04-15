import { Component } from '@angular/core';

@Component({
  selector: 'app-work',
  standalone: true,
  template: `
    <section class="page">
      <h1>Work</h1>
      <p>Projects grid goes here.</p>
    </section>
  `,
  styles: [`.page { max-width: var(--container-max); margin: 0 auto; padding: var(--space-16) var(--container-pad); } h1 { font-family: var(--font-display); font-size: clamp(2.5rem, 6vw, 5rem); letter-spacing: -0.03em; margin-bottom: var(--space-8); }`],
})
export class WorkComponent {}
