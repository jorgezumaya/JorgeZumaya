import { Component, input } from '@angular/core';
import { Project } from './projects.data';

@Component({
  selector: 'app-project-card',
  standalone: true,
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
})
export class ProjectCardComponent {
  project = input.required<Project>();

  onTilt(e: MouseEvent): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const card = e.currentTarget as HTMLElement;
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * 12;
    const y = ((e.clientY - top) / height - 0.5) * -12;
    card.style.transform = `perspective(700px) rotateX(${y}deg) rotateY(${x}deg)`;
  }

  resetTilt(e: MouseEvent): void {
    (e.currentTarget as HTMLElement).style.transform = '';
  }
}
