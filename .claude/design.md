# Design System

## Color Palette (high-contrast mono + electric accent)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#0A0A0A` | Page background |
| `--color-surface` | `#141414` | Cards, modals, nav |
| `--color-text` | `#FAFAFA` | Primary text |
| `--color-muted` | `#8A8A8A` | Secondary/placeholder text |
| `--color-border` | `#242424` | Dividers, card borders |
| `--color-accent` | `#FF3D00` | CTAs, highlights, active states |
| `--color-accent-alt` | `#FFB300` | Gradients, hover transitions |

Accent rationale: electric orange over mono signals energy without defaulting to cliché tech-blue.

## Typography

| Role | Font | Notes |
|------|------|-------|
| Display | Space Grotesk or Clash Display | Bold, geometric, personality — headings & hero |
| Body | Inter | Clean, readable — paragraphs & UI |
| Mono | JetBrains Mono | Code snippets, tech tag chips |

Load via Google Fonts / Fontsource. Subset to used weights only.

## Motion Language

- Page transitions: Angular `@angular/animations` + View Transitions API
- Scroll-driven: GSAP + ScrollTrigger
- Hero: animated text reveal + cursor-follow accent orb + subtle grain texture overlay
- Hover: magnetic buttons (`magnetic.directive.ts`), image tilt on project cards
- **Always respect `prefers-reduced-motion`** — wrap GSAP init in a media query check

```ts
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced) { /* init GSAP */ }
```

## Responsive Breakpoints

| Name | Width |
|------|-------|
| Mobile | < 768px |
| Tablet | 768px – 1199px |
| Desktop | ≥ 1200px |

## Spacing Scale
Use multiples of 8px: `8 / 16 / 24 / 32 / 48 / 64 / 96 / 128`.

## Component Visual Notes

### Hero
- Full viewport height
- Kinetic type: "Jorge Zumaya — Full Stack Engineer" (Space Grotesk, massive)
- Orange accent orb follows cursor (CSS radial gradient on `mousemove`)
- Scroll indicator arrow at bottom
- Grain texture via SVG filter or CSS noise

### Nav
- Sticky top, blurs background on scroll (`backdrop-filter: blur(12px)`)
- Mobile: slide-in drawer

### Project Cards
- Cover image with hover tilt (GSAP + mouse position)
- Stack tag chips (JetBrains Mono, small)
- Orange accent on hover border

### Timeline (Experience)
- Alternating left/right on desktop, stacked on mobile
- Fidelity roles grouped under one company header showing progression

### Gallery
- 3-col desktop, 2-col tablet, 1-col mobile
- Square-cropped tiles
- Hover: overlay with caption + faux like count (❤ ###)
- Click: lightbox modal with full image, caption, date
- Lazy load: `loading="lazy"` + IntersectionObserver

### Contact
- Split layout: left = oversized "Let's talk." + direct links; right = form
- Fields: name, email, subject, message + hidden honeypot
- Animated checkmark on success
