import { Component, afterNextRender } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FAVICONS } from './shared/constants';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class App {
  constructor() {
    afterNextRender(() => {
      const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (icon) {
        icon.href = FAVICONS[Math.floor(Math.random() * FAVICONS.length)];
      }
    });
  }
}
