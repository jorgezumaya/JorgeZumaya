import { Component } from '@angular/core';
import { RevealDirective } from '../../core/directives/reveal.directive';

interface Role {
  title: string;
  period: string;
  bullets: string[];
  stack: string[];
}

interface Company {
  name: string;
  location: string;
  roles: Role[];
}

interface Education {
  degree: string;
  institution: string;
  period: string;
  note?: string;
}

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  date: string;
}

interface TechCategory {
  label: string;
  chips: string[];
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
})
export class ExperienceComponent {
  companies: Company[] = [
    {
      name: 'Fidelity Investments',
      location: 'Fort Worth, TX',
      roles: [
        {
          title: 'Full Stack Engineer',
          period: 'Jan 2023 – Present',
          bullets: [
            'Serve as SME for Salesforce/Digital Engagement and Client Messages platform, providing KT sessions to ACE team on Customer Engagement, eNotify, and ACE Assignment APIs',
            'Led Salesforce Seasonal Release validation across the squad',
            'Delivered executive-level demo of Client Messages platform to senior leadership with ~1 week of notice, exceeding expectations',
            'Architected URL generation API for APEx to replace legacy Salesforce Apex logic, built and validated in non-prod',
            'Coached teammates across squads on Salesforce and Digital Engagement; recognized multiple times with "Fidelity On the Spot" and "Coaches Others to Their Full Potential" awards',
          ],
          stack: [
            'Angular',
            'TypeScript',
            'Java',
            'Spring Boot',
            'Salesforce',
            'REST APIs',
            'GCP',
            'GitHub Actions',
          ],
        },
        {
          title: 'Associate Software Engineer',
          period: 'Oct 2021 – Jan 2023',
          bullets: [
            'Supported the appointment scheduling tool hosted on Salesforce cloud communities, client messages, and customer engagement efforts',
            'Assisted in migrating the scheduling functionality from Communities onto the Angular GraphQL PI monorepo',
            'Implemented REST API development best practices across presentation and smart components',
            'Leveraged Salesforce Connected Apps to retrieve data for use in Angular',
          ],
          stack: ['Angular', 'TypeScript', 'Salesforce', 'GraphQL', 'REST APIs'],
        },
        {
          title: 'Software Engineering Intern',
          period: 'Jun 2021 – Oct 2021',
          bullets: [
            'Developed Salesforce LWC data components for the Client Messaging tool',
            'Dynamically pulled user, client, and static metadata from Salesforce via SOQL',
            'Sent dynamic emails to customers leveraging Salesforce Marketing Cloud Journeys',
          ],
          stack: ['Salesforce LWC', 'Apex', 'SOQL', 'Marketing Cloud'],
        },
        {
          title: 'Software Engineering Intern',
          period: 'Jun 2020 – Aug 2020',
          bullets: [
            'Developed features for Fidelity internal learning tool LevelUp using EmberJS and Elixir',
            'Worked in an agile environment leveraging Scrum alongside other interns',
            'Managed enterprise tools: JIRA for work management, Bitbucket for source control, Jenkins for builds, Docker for containerization',
          ],
          stack: ['EmberJS', 'Elixir', 'JIRA', 'Docker', 'Jenkins'],
        },
      ],
    },
  ];

  education: Education[] = [
    {
      degree: 'M.B.A. — Information Technology Management',
      institution: 'Western Governors University',
      // TODO: confirm exact start date and expected graduation year
      period: '2024 – Present',
      note: 'Expected graduation 2026',
    },
    {
      degree: 'B.S. Computer Engineering, Cum Laude',
      institution: 'The University of Texas at Arlington',
      period: '2018 – 2021',
      note: 'Minor in Spanish Linguistics',
    },
  ];

  techStack: TechCategory[] = [
    { label: 'Frontend', chips: ['Angular', 'TypeScript', 'RxJS', 'SCSS', 'HTML'] },
    {
      label: 'Backend',
      chips: ['Node.js', 'Java', 'Spring Boot', 'REST APIs', 'Salesforce Apex'],
    },
    { label: 'Cloud / Infra', chips: ['Firebase', 'GCP', 'GitHub Actions'] },
    { label: 'Tools', chips: ['Git', 'Figma', 'Salesforce', 'Datadog', 'Splunk'] },
  ];

  testimonials: Testimonial[] = [
    {
      quote:
        'Jorge continues to be my go-to resource for anything related to Digital Engagements, Salesforce, and Client Messages. He absolutely exceeded expectations delivering a clear, high-level demo that gave attendees a strong understanding of the application.',
      author: 'Jordan Goudie',
      role: 'Colleague, Fidelity Investments',
      date: 'April 2026',
    },
    {
      quote:
        'Jorge is growing into a developer that others come to for answers and guidance. He has done great work on the URL generation API for APEx and has been branching out into areas that are new to him.',
      author: 'Chris Martin',
      role: 'Senior Engineer, Fidelity Investments',
      date: 'April 2026',
    },
    {
      quote:
        'Jorge consistently goes above and beyond in delivering high quality client message development work in Salesforce, demonstrating exceptional clarity, ownership, and impact.',
      author: 'Yugandhar Yalamuru',
      role: 'Colleague, Fidelity Investments',
      date: 'December 2025',
    },
    {
      quote:
        "I want to give a shoutout to Jorge for consistently going above and beyond to help me and others out whenever he can. Whether it's jumping in to solve a problem or connecting me with the right person, your support has been critical for our product area.",
      author: 'Jason Joy',
      role: 'Colleague, Fidelity Investments',
      date: 'June 2025',
    },
  ];
}
