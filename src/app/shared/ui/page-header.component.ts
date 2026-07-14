import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  template: `
    <p class="eyebrow">{{ eyebrow() }}</p>
    <h1>{{ title() }}</h1>
    @if (subtitle()) {
      <p class="page__sub">{{ subtitle() }}</p>
    }
  `,
  styleUrl: './page-header.component.scss',
})
export class PageHeaderComponent {
  eyebrow = input.required<string>();
  title = input.required<string>();
  subtitle = input<string>();
}
