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
  // TODO: update to Firebase Storage URL once resume PDF is uploaded
  readonly resumeUrl = 'assets/resume.pdf';

  companies: Company[] = [
    {
      name: 'Fidelity Investments',
      location: 'Westlake, TX',
      roles: [
        {
          title: 'Full Stack Engineer',
          period: 'Jan 2023 – Present',
          bullets: [
            // Internal system names generalized — safer for compliance and clearer to recruiters
            'Subject matter expert for the Salesforce-based client communications platform; led knowledge transfer sessions across the engineering team covering customer engagement, notification, and agent-assignment APIs',
            'Led Salesforce Seasonal Release validation across the squad, coordinating testing and sign-off for production readiness',
            'Delivered an executive-level demo of the client communications platform to senior leadership with ~1 week of notice — recognized for clarity and depth by stakeholders',
            'Architected a REST API to replace legacy Salesforce Apex link-generation logic; designed, built, and validated end-to-end in non-prod environments',
            'Coached teammates across squads on Salesforce and platform architecture; recognized multiple times with "Fidelity On the Spot" and "Coaches Others to Their Full Potential" awards',
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
            'Supported the appointment scheduling tool hosted on Salesforce cloud communities, including client messaging and customer engagement workflows',
            'Assisted in migrating scheduling functionality from Salesforce Communities onto the Angular GraphQL PI monorepo',
            'Implemented REST API best practices across presentation and smart components',
            'Leveraged Salesforce Connected Apps to retrieve and surface data within Angular',
          ],
          stack: ['Angular', 'TypeScript', 'Salesforce', 'GraphQL', 'REST APIs'],
        },
        {
          title: 'Software Engineering Intern',
          period: 'Jun 2021 – Oct 2021',
          bullets: [
            'Developed Salesforce Lightning Web Components for a client messaging tool',
            'Dynamically pulled user, client, and metadata from Salesforce via SOQL to power dynamic email delivery',
            'Leveraged Salesforce Marketing Cloud Journeys to send targeted, personalized communications to customers',
          ],
          stack: ['Salesforce LWC', 'Apex', 'SOQL', 'Marketing Cloud'],
        },
        {
          title: 'Software Engineering Intern',
          period: 'Jun 2020 – Aug 2020',
          bullets: [
            'Developed features for an internal learning platform using EmberJS and Elixir',
            'Worked in an agile environment leveraging Scrum alongside other interns',
            'Managed enterprise tools: JIRA, Bitbucket, Jenkins, and Docker',
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
      period: 'March 2025 – Present',
      note: 'Expected graduation May 2026',
    },
    {
      degree: 'B.S. Computer Engineering, Cum Laude',
      institution: 'The University of Texas at Arlington',
      period: '2018 – 2021',
      note: 'Minor in Spanish Linguistics',
    },
  ];

  techStack: TechCategory[] = [
    { label: 'Frontend', chips: ['Angular', 'TypeScript', 'RxJS', 'SCSS', 'HTML', 'EmberJS'] },
    {
      label: 'Backend',
      chips: ['Node.js', 'Java', 'CI/CD', 'REST APIs', 'Salesforce Apex/SOQL', 'GraphQL'],
    },
    { label: 'Cloud / Infra', chips: ['Firebase', 'GCP', 'GitHub Actions','Jenkins', 'Cloudfare'] },
    { label: 'Tools', chips: ['Git', 'Figma', 'Salesforce', 'Datadog', 'Splunk', 'Version Control', 'Argo CD', 'Postman'] },
  ];

  testimonials: Testimonial[] = [
    {
      // Revised: removed internal platform names ("Digital Engagements", "Client Messages")
      // — clearer to external recruiters, no proprietary tool names exposed
      quote:
        'Jorge continues to be my go-to resource for anything Salesforce and client communications. He absolutely exceeded expectations delivering a clear, high-level demo that gave attendees a strong understanding of the application.',
      author: 'Jordan Goudie',
      role: 'Colleague, Fidelity Investments',
      date: 'April 2026',
    },
    {
      // Revised: replaced internal product name "APEx" with a description of what it is
      // — meaning preserved, internal codename removed
      quote:
        'Jorge is growing into a developer that others come to for answers and guidance. He has done great work architecting a URL generation API to replace legacy Salesforce Apex logic, and has been branching out into areas that are new to him.',
      author: 'Chris Martin',
      role: 'Senior Engineer, Fidelity Investments',
      date: 'April 2026',
    },
    {
      // No changes needed — "client message development work in Salesforce" is clear and generic
      quote:
        'Jorge consistently goes above and beyond in delivering high quality client message development work in Salesforce, demonstrating exceptional clarity, ownership, and impact.',
      author: 'Yugandhar Yalamuru',
      role: 'Colleague, Fidelity Investments',
      date: 'December 2025',
    },
    {
      // No changes needed — entirely behavioral, no product names
      quote:
        "I want to give a shoutout to Jorge for consistently going above and beyond to help me and others out whenever he can. Whether it's jumping in to solve a problem or connecting me with the right person, your support has been critical for our product area.",
      author: 'Jason Joy',
      role: 'Colleague, Fidelity Investments',
      date: 'June 2025',
    },
  ];
}
