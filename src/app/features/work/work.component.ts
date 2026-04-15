import { Component } from '@angular/core';
import { ProjectCardComponent } from '../../shared/project-card.component';
import { PROJECTS, Project } from '../../shared/projects.data';
import { RevealDirective } from '../../core/directives/reveal.directive';

@Component({
  selector: 'app-work',
  standalone: true,
  imports: [ProjectCardComponent, RevealDirective],
  templateUrl: './work.component.html',
  styleUrl: './work.component.scss',
})
export class WorkComponent {
  projects: Project[] = PROJECTS;
}
