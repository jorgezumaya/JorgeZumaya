import {
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type Lang = 'en' | 'es' | 'pt' | 'hi';

interface LangOption {
  code: Lang;
  label: string;
  flag: string;
}

const FONT_LINK_ID = 'app-prospects-fonts';
const LANG_STORAGE_KEY = 'prospects-lang';
const WHATSAPP_NUMBER = '18178225269';
const WHATSAPP_MESSAGES: Record<Lang, string> = {
  en: "Hi Jorge, I saw your page and I'm interested in a website.",
  es: 'Hola Jorge, vi su página y me interesa un sitio web.',
  pt: 'Oi Jorge, vi sua página e tenho interesse em um site.',
  hi: 'नमस्ते Jorge, मैंने आपका पेज देखा और मुझे वेबसाइट बनवानी है।',
};
const TILE_SIZE = 74;
const TILE_INTERVAL_MS = 420;
const TILE_LIT_MS = 2400;
const TILE_RED_CHANCE = 0.28;

@Component({
  selector: 'app-prospects',
  standalone: true,
  templateUrl: './prospects.component.html',
  styleUrl: './prospects.component.scss',
})
export class ProspectsComponent implements OnDestroy {
  private readonly host: HTMLElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly platformId = inject(PLATFORM_ID);
  private tileInterval?: ReturnType<typeof setInterval>;
  private readonly onResize = () => this.buildTiles();
  private readonly onDocumentClick = (event: MouseEvent) => {
    if (this.menuOpen() && !(event.target as HTMLElement).closest('.lang-menu')) {
      this.menuOpen.set(false);
    }
  };

  readonly languages: LangOption[] = [
    { code: 'en', label: 'English', flag: 'us' },
    { code: 'es', label: 'Español', flag: 'mx' },
    { code: 'pt', label: 'Português', flag: 'br' },
    { code: 'hi', label: 'हिन्दी', flag: 'in' },
  ];
  readonly lang = signal<Lang>('en');
  readonly menuOpen = signal(false);
  readonly current = computed(() => this.languages.find((l) => l.code === this.lang())!);

  constructor() {
    afterNextRender(() => {
      this.loadFonts();
      this.buildTiles();
      window.addEventListener('resize', this.onResize);
      document.addEventListener('click', this.onDocumentClick);

      const initial = this.initialLang();
      if (initial !== 'en') this.applyLang(initial);

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduceMotion) {
        this.tileInterval = setInterval(() => this.animateRandomTile(), TILE_INTERVAL_MS);
      }
    });
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.onResize);
      document.removeEventListener('click', this.onDocumentClick);
    }
    clearInterval(this.tileInterval);
  }

  scrollToSection(event: Event, id: string): void {
    event.preventDefault();
    this.host.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.menuOpen.update((open) => !open);
  }

  choose(lang: Lang): void {
    this.menuOpen.set(false);
    this.applyLang(lang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // Storage unavailable (private mode) — language still applies for this visit
    }
  }

  private applyLang(lang: Lang): void {
    this.lang.set(lang);
    this.host.querySelectorAll<HTMLElement>('[data-en]').forEach((el) => {
      const val = el.getAttribute(`data-${lang}`);
      if (val !== null) el.innerHTML = val;
    });
    // Longer-running copy (PT, HI) gets stylesheet adjustments via a host class
    (['es', 'pt', 'hi'] as const).forEach((l) => {
      this.host.classList.toggle(`lang-${l}`, lang === l);
    });
    const waLink = this.host.querySelector<HTMLAnchorElement>('#wa-link');
    if (waLink) {
      waLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGES[lang])}`;
    }
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang;
  }

  /** Saved choice wins; otherwise match the browser/phone language; default English. */
  private initialLang(): Lang {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'en' || saved === 'es' || saved === 'pt' || saved === 'hi') return saved;
    } catch {
      // Storage unavailable — fall through to browser language detection
    }
    const candidates = navigator.languages?.length ? navigator.languages : [navigator.language];
    for (const candidate of candidates) {
      const base = candidate?.toLowerCase().split('-')[0];
      if (base === 'pt') return 'pt';
      if (base === 'es') return 'es';
      if (base === 'hi') return 'hi';
      if (base === 'en') return 'en';
    }
    return 'en';
  }

  private loadFonts(): void {
    if (document.getElementById(FONT_LINK_ID)) return;

    const preconnect1 = document.createElement('link');
    preconnect1.rel = 'preconnect';
    preconnect1.href = 'https://fonts.googleapis.com';

    const preconnect2 = document.createElement('link');
    preconnect2.rel = 'preconnect';
    preconnect2.href = 'https://fonts.gstatic.com';
    preconnect2.crossOrigin = 'anonymous';

    const stylesheet = document.createElement('link');
    stylesheet.id = FONT_LINK_ID;
    stylesheet.rel = 'stylesheet';
    stylesheet.href =
      'https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700&family=Archivo+Black&family=IBM+Plex+Mono:wght@400;500&family=Noto+Sans+Devanagari:wght@500;700;900&display=swap';

    document.head.append(preconnect1, preconnect2, stylesheet);
  }

  private buildTiles(): void {
    const field = this.host.querySelector<HTMLElement>('#tileField');
    const hero = this.host.querySelector<HTMLElement>('header.hero');
    if (!field || !hero) return;

    field.innerHTML = '';
    const cols = Math.ceil(hero.offsetWidth / TILE_SIZE);
    const rows = Math.ceil(hero.offsetHeight / TILE_SIZE);
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < cols * rows; i++) {
      const tile = document.createElement('div');
      tile.className = 'tile';
      fragment.append(tile);
    }
    field.append(fragment);
  }

  private animateRandomTile(): void {
    const field = this.host.querySelector<HTMLElement>('#tileField');
    const tiles = field?.children;
    if (!tiles?.length) return;

    const idx = Math.floor(Math.random() * tiles.length);
    const tile = tiles[idx];
    const cls = Math.random() < TILE_RED_CHANCE ? 'lit-red' : 'lit';
    tile.classList.add(cls);
    setTimeout(() => tile.classList.remove(cls), TILE_LIT_MS);
  }
}
