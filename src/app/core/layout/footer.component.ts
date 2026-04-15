import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="footer__inner">
        <p class="footer__copy">© {{ year }} Jorge Zumaya</p>
        <ul class="footer__social">
          <li>
            <a href="https://www.linkedin.com/in/jorgezumaya/" target="_blank" rel="noopener"
              >LinkedIn</a
            >
          </li>
          <li>
            <a href="https://github.com/jorgezumaya" target="_blank" rel="noopener">GitHub</a>
          </li>
          <li><a href="mailto:jorge.juarez87@me.com">Email</a></li>
        </ul>
      </div>
    </footer>
  `,
  styles: [
    `
      .footer {
        border-top: 1px solid var(--color-border);
        padding: var(--space-8) var(--container-pad);
        color: var(--color-text-mute);
        font-family: var(--font-mono);
        font-size: 0.875rem;
      }
      .footer__inner {
        max-width: var(--container-max);
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: var(--space-4);
      }
      .footer__social {
        display: flex;
        gap: var(--space-4);
        list-style: none;
      }
      .footer__social a:hover {
        color: var(--color-accent);
      }
    `,
  ],
})
export class FooterComponent {
  year = new Date().getFullYear();
}
