import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectCardComponent } from '../../shared/project-card.component';
import { PROJECTS, Project } from '../../shared/projects.data';
import { RevealDirective } from '../../core/directives/reveal.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ProjectCardComponent, RevealDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  featuredProjects: Project[] = PROJECTS.filter((p) => p.featured);

  featuredQuote = {
    text: 'Jorge continues to be my go-to resource for anything related to Digital Engagements, Salesforce, and Client Messages. He absolutely exceeded expectations delivering a clear, high-level demo that gave attendees a strong understanding of the application.',
    author: 'Jordan Goudie',
    role: 'Colleague, Fidelity Investments',
  };
}
