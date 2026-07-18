import { Directive, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';
import { injectIsBrowser } from '../../shared/utils/platform';

@Directive({
  selector: '[appReveal]',
  standalone: true,
  host: { class: 'reveal' },
})
export class RevealDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef<HTMLElement>);
  private isBrowser = injectIsBrowser();
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    // IntersectionObserver is browser-only — no-op during SSR
    if (!this.isBrowser) {
      this.el.nativeElement.classList.add('is-visible');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
