import {
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../../core/services/contact.service';
import { WHATSAPP_NUMBER } from '../../shared/constants';
import { createToast } from '../../shared/forms/toast';
import { injectIsBrowser } from '../../shared/utils/platform';
import { loadGoogleFonts } from '../../shared/dom/load-google-fonts';
import {
  FORM_STRINGS,
  LANG_STORAGE_KEY,
  Lang,
  LangOption,
  WHATSAPP_MESSAGES,
  initialLang,
} from './prospects-i18n';

const FONT_LINK_ID = 'app-prospects-fonts';
const TILE_SIZE = 74;
const TILE_INTERVAL_MS = 420;
const TILE_LIT_MS = 2400;
const TILE_RED_CHANCE = 0.28;

@Component({
  selector: 'app-prospects',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './prospects.component.html',
  styleUrl: './prospects.component.scss',
})
export class ProspectsComponent implements OnDestroy {
  private readonly host: HTMLElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly isBrowser = injectIsBrowser();
  private readonly fb = inject(FormBuilder);
  private readonly contact = inject(ContactService);
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
  readonly t = computed(() => FORM_STRINGS[this.lang()]);

  readonly waHref = this.buildWaHref('en');
  readonly telHref = `tel:+${WHATSAPP_NUMBER}`;

  private readonly toastState = createToast(6000);
  readonly sending = signal(false);
  readonly toast = this.toastState.toast;
  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
    website: [''], // honeypot — real people leave this blank
  });

  constructor() {
    afterNextRender(() => {
      this.loadFonts();
      this.buildTiles();
      window.addEventListener('resize', this.onResize);
      document.addEventListener('click', this.onDocumentClick);

      const initial = initialLang();
      if (initial !== 'en') this.applyLang(initial);

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduceMotion) {
        this.tileInterval = setInterval(() => this.animateRandomTile(), TILE_INTERVAL_MS);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
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

  fieldInvalid(field: 'name' | 'email' | 'message'): boolean {
    const ctrl = this.form.controls[field];
    return ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  async submit(): Promise<void> {
    this.toast.set(null);
    this.form.markAllAsTouched();
    // Honeypot filled or invalid form → stop (silently for bots)
    if (this.form.controls.website.value || this.form.invalid) return;

    this.sending.set(true);
    try {
      const { name, email, message } = this.form.getRawValue();
      await this.contact.submit({
        name,
        email,
        subject: `Prospects lead (${this.lang().toUpperCase()})`,
        message,
      });
      this.form.reset();
      this.toastState.show('success');
    } catch (err) {
      console.error('[prospects] contact submit failed:', err);
      this.toastState.show('error');
    } finally {
      this.sending.set(false);
    }
  }

  // TODO: architectural debt — this component swaps copy via raw DOM attributes/innerHTML
  // instead of the signal/computed template bindings used elsewhere in the app. Works, but is
  // untestable via TestBed and invisible to change detection. Consider migrating to computed()
  // text bindings if this page grows further.
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
      waLink.href = this.buildWaHref(lang);
    }
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang;
  }

  private buildWaHref(lang: Lang): string {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGES[lang])}`;
  }

  private loadFonts(): void {
    loadGoogleFonts(
      'https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700&family=Archivo+Black&family=IBM+Plex+Mono:wght@400;500&family=Noto+Sans+Devanagari:wght@500;700;900&display=swap',
      FONT_LINK_ID,
      [
        { href: 'https://fonts.googleapis.com' },
        { href: 'https://fonts.gstatic.com', crossOrigin: true },
      ],
    );
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
