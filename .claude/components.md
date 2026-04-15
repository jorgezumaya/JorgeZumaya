# Component Architecture

All components are Angular standalone. Use signals for state. Lazy-load every route.

## Directory Tree

```
src/app/
├── core/
│   ├── layout/
│   │   ├── shell.component.ts          # Router outlet + nav + footer
│   │   ├── nav.component.ts            # Sticky top nav, mobile drawer
│   │   └── footer.component.ts
│   ├── services/
│   │   ├── firebase.service.ts         # Init + DI providers
│   │   ├── gallery.service.ts          # Storage photo fetching + metadata
│   │   ├── contact.service.ts          # Firestore writes (contact form)
│   │   └── analytics.service.ts        # GA4 or Plausible wrapper
│   └── directives/
│       ├── magnetic.directive.ts       # Magnetic hover effect on buttons
│       └── reveal.directive.ts         # Scroll-triggered reveal (GSAP)
├── features/
│   ├── home/
│   │   ├── home.component.ts           # Route: /
│   │   ├── hero.component.ts           # Kinetic type + cursor orb + grain
│   │   ├── featured-work.component.ts  # 3 top projects staggered grid
│   │   └── cta-strip.component.ts      # "Let's build something" → /contact
│   ├── experience/
│   │   ├── experience.component.ts     # Route: /experience
│   │   ├── timeline.component.ts       # Orchestrates entries
│   │   └── timeline-entry.component.ts # Single role/edu entry
│   ├── work/
│   │   ├── work.component.ts           # Route: /work
│   │   └── project-card.component.ts   # Tilt card with cover + tags
│   ├── gallery/
│   │   ├── gallery.component.ts        # Route: /gallery
│   │   ├── photo-tile.component.ts     # IG-style square tile
│   │   └── photo-modal.component.ts    # Lightbox with caption + date
│   └── contact/
│       ├── contact.component.ts        # Route: /contact
│       └── contact-form.component.ts   # Reactive form + App Check
└── shared/
    ├── ui/
    │   ├── button.component.ts         # Magnetic-capable CTA button
    │   ├── chip.component.ts           # Tech stack tag chip
    │   └── section-heading.component.ts
    └── pipes/
        └── truncate.pipe.ts
```

## Route Config (app.routes.ts)

```ts
export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home.component') },
  { path: 'experience', loadComponent: () => import('./features/experience/experience.component') },
  { path: 'work', loadComponent: () => import('./features/work/work.component') },
  { path: 'gallery', loadComponent: () => import('./features/gallery/gallery.component') },
  { path: 'contact', loadComponent: () => import('./features/contact/contact.component') },
  { path: '**', redirectTo: '' }
];
```

## Key Patterns

### Signals for state
```ts
// Prefer signals over BehaviorSubject
photos = signal<Photo[]>([]);
loading = signal(false);
filteredPhotos = computed(() => this.photos().filter(...));
```

### GSAP + Angular
- Init GSAP in `ngAfterViewInit`, destroy in `ngOnDestroy`
- Use `gsap.context()` scoped to the component's element ref for cleanup
- Always guard with `prefers-reduced-motion` check

### Magnetic Directive
Applied via `appMagnetic` selector on `<button>` or `<a>` elements.
Uses `mousemove` / `mouseleave` to translate the element toward the cursor.

### Reveal Directive
Applied via `appReveal` selector. Uses ScrollTrigger to fade+translate element in when it enters the viewport.
