export interface Project {
  slug: string;
  title: string;
  description: string;
  stack: string[];
  featured: boolean;
  link?: string;
}

export const PROJECTS: Project[] = [
  {
    slug: 'apex-url-api',
    title: 'APEx URL Generation API',
    description:
      'Replaced legacy Salesforce Apex link-generation logic with a new REST API built and validated in non-prod. Reduces technical debt and improves maintainability across the platform.',
    stack: ['Java', 'Spring Boot', 'Salesforce Apex', 'REST APIs', 'GCP'],
    featured: true,
  },
  {
    slug: 'client-messages-platform',
    title: 'Client Messages Platform',
    description:
      "SME and contributor on Fidelity's Salesforce-based client messaging system. Delivered KT sessions, led seasonal release validation, and presented a platform demo to senior leadership.",
    stack: ['Salesforce', 'Digital Engagement', 'Angular', 'TypeScript'],
    featured: true,
  },
  {
    slug: 'portfolio-site',
    title: 'jorgezumaya.me',
    description:
      'This site — Angular 21 SSR, Firebase Hosting, CI/CD via GitHub Actions. Lighthouse score gated in CI.',
    stack: ['Angular', 'Firebase', 'SCSS', 'GitHub Actions'],
    link: 'https://jorgezumaya.me',
    featured: true,
  },
  {
    slug: 'avila-contracting',
    title: 'Avila Contracting LLC',
    description:
      'Full-stack business web app for a local contracting company. Public marketing pages alongside a protected admin dashboard with a bid generator, client contacts manager, and project history tracker. Auth0 + Firebase authentication, responsive Angular Material sidenav, SSR, and a Vitest test suite.',
    stack: ['Angular', 'Auth0', 'Firebase', 'Angular Material', 'TypeScript', 'SSR'],
    featured: false,
    link: 'https://avilacontractingllc.com',
  },
];
