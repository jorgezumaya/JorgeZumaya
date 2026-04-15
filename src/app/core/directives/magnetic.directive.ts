import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appMagnetic]',
  standalone: true,
})
export class MagneticDirective {
  private el = inject(ElementRef<HTMLElement>);
  private strength = 0.35;

  @HostListener('mousemove', ['$event'])
  onMove(e: MouseEvent): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    this.el.nativeElement.style.transform = `translate(${x * this.strength}px, ${y * this.strength}px)`;
  }

  @HostListener('mouseleave')
  onLeave(): void {
    this.el.nativeElement.style.transform = 'translate(0, 0)';
  }
}
