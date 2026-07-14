import { Component, input } from '@angular/core';

@Component({
  selector: 'app-chip-list',
  standalone: true,
  template: `
    <ul class="chip-list">
      @for (item of items(); track item) {
        <li class="chip">{{ item }}</li>
      }
    </ul>
  `,
  styleUrl: './chip-list.component.scss',
})
export class ChipListComponent {
  items = input.required<string[]>();
}
