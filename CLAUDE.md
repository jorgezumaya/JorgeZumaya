# JorgeZumaya Portfolio — Claude Context

Personal portfolio site for Jorge Zumaya, Full Stack Engineer at Fidelity Investments.

## Quick Reference
- Design doc: `.claude/design.md`
- Component map: `.claude/components.md`
- Firebase + infra: `.claude/infra.md`
- Content + copy: `.claude/content.md`

## Stack
- **Framework**: Angular 21, standalone components, signals, SSR (`@angular/ssr`)
- **Styling**: SCSS + CSS custom properties (design tokens defined in `.claude/design.md`)
- **Animation**: GSAP + ScrollTrigger, Angular Animations, View Transitions API
- **Icons**: Lucide Angular
- **Forms**: Reactive Forms
- **Hosting**: Firebase Hosting (custom domain: jorgezumaya.me via Cloudflare)
- **DB**: Firestore (contact submissions, gallery metadata)
- **Storage**: Firebase Storage (gallery photos — original, large WebP, thumb WebP)
- **Spam**: App Check (reCAPTCHA v3) + honeypot field
- **CI/CD**: GitHub Actions (PR previews → Firebase preview channels; main → live)
- **Perf gate**: Lighthouse CI (score < 90 fails build)

## Coding Conventions
- All components are standalone (`standalone: true`)
- Use Angular signals (`signal()`, `computed()`, `effect()`) for state — no NgRx
- SCSS: use CSS custom properties (`--color-accent`, etc.) defined in `:root`, never hardcode hex values in component styles
- Respect `prefers-reduced-motion` in all animations
- Lazy-load every route
- No `any` TypeScript — type everything

## Routes
| Path | Component | Notes |
|------|-----------|-------|
| `/` | HomeComponent | Hero + highlights |
| `/experience` | ExperienceComponent | Timeline |
| `/work` | WorkComponent | Projects grid |
| `/work/:slug` | ProjectDetailComponent | Phase 2 |
| `/gallery` | GalleryComponent | Photo grid |
| `/contact` | ContactComponent | Contact form |

## Do Not
- Do not hardcode Firebase config — it lives in `environment.ts`
- Do not write to Firestore `gallery` collection from the client — read only
- Do not skip App Check on the contact form submission path
- Do not add NgModules — everything is standalone
