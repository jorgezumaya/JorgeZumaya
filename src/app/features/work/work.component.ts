import { Component } from '@angular/core';
import { ProjectCardComponent } from '../../shared/project-card.component';
import { PROJECTS, Project } from '../../shared/projects.data';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { PageHeaderComponent } from '../../shared/ui/page-header.component';

@Component({
  selector: 'app-work',
  standalone: true,
  imports: [ProjectCardComponent, RevealDirective, PageHeaderComponent],
  templateUrl: './work.component.html',
  styleUrl: './work.component.scss',
})
export class WorkComponent {
  projects: Project[] = PROJECTS;
}
