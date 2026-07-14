import { Component, input } from '@angular/core';
import { Project } from './projects.data';
import { ChipListComponent } from './ui/chip-list.component';
import { computeTilt, prefersReducedMotion } from './utils/motion';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [ChipListComponent],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
})
export class ProjectCardComponent {
  project = input.required<Project>();

  onTilt(e: MouseEvent): void {
    if (prefersReducedMotion()) return;
    const card = e.currentTarget as HTMLElement;
    const { rotateX, rotateY } = computeTilt(e.clientX, e.clientY, card.getBoundingClientRect());
    card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }

  resetTilt(e: MouseEvent): void {
    (e.currentTarget as HTMLElement).style.transform = '';
  }
}
