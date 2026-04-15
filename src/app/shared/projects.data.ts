export interface Project {
  slug: string;
  title: string;
  description: string;
  stack: string[];
  featured: boolean;
  link?: string;
}

// TODO: add more projects from resume when available
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
];
