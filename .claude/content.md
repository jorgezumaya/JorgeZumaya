# Content & Copy Reference

Source of truth for real content to use when building components.
Update this file as content evolves.

## Identity
- **Name**: Jorge Zumaya
- **Title**: Full Stack Engineer
- **Current employer**: Fidelity Investments
- **Location**: [TBD — add if desired]
- **Domain**: jorgezumaya.me

## Hero Headline
Primary: "Jorge Zumaya — Full Stack Engineer"
Sub: "Currently building at Fidelity Investments."
CTA: "Let's build something" → /contact

## Experience (Timeline)

### Fidelity Investments (grouped — show progression)
- **Software Engineering Intern** → **Associate Software Engineer** → **Full Stack Engineer**
- Highlight the progression in the timeline header

### Education
- MBA — [Institution, Year] _(almost done as of 2026)_
- [Add undergrad details]

## Tech Stack Chips (Experience page, by category)
Populate from resume. Categories:
- **Frontend**: Angular, TypeScript, RxJS, SCSS, HTML
- **Backend**: Node.js, Java, Spring Boot, REST APIs
- **Cloud/Infra**: Firebase, GCP, GitHub Actions
- **Tools**: Git, Figma, Salesforce
- _(Update with full resume details)_

## Projects (Work page)
Add project entries here as they are defined:
```
[
  {
    slug: 'project-slug',
    title: 'Project Name',
    description: 'One-liner',
    stack: ['Angular', 'Firebase'],
    coverImage: '/assets/projects/project-slug.webp',
    link: 'https://...',    // optional
    featured: true           // shows on home page
  }
]
```

## Contact / Social Links
- Email: [add]
- LinkedIn: [add]
- GitHub: [add]

## Gallery
- Photos sourced from Firebase Storage (`/gallery/original/`)
- Captions + metadata stored in Firestore `gallery` collection
- Upload manually via Firebase Console or a small admin script

## SEO / Meta
- Default OG title: "Jorge Zumaya — Full Stack Engineer"
- Default OG description: "Portfolio of Jorge Zumaya, Full Stack Engineer at Fidelity Investments."
- OG image: `/assets/og-image.jpg` (1200×630, to be created)
- Prerender all static routes via `@angular/ssr`
