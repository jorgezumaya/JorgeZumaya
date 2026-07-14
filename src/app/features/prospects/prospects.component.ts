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
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../../core/services/contact.service';
import { WHATSAPP_NUMBER } from '../../shared/constants';
import { createToast } from '../../shared/forms/toast';

type Lang = 'en' | 'es' | 'pt' | 'hi';

interface LangOption {
  code: Lang;
  label: string;
  flag: string;
}

interface FormStrings {
  namePh: string;
  emailPh: string;
  messagePh: string;
  send: string;
  sending: string;
  success: string;
  error: string;
}

const FONT_LINK_ID = 'app-prospects-fonts';
const LANG_STORAGE_KEY = 'prospects-lang';
const WHATSAPP_MESSAGES: Record<Lang, string> = {
  en: "Hi Jorge, I saw your page and I'm interested in a website.",
  es: 'Hola Jorge, vi su página y me interesa un sitio web.',
  pt: 'Oi Jorge, vi sua página e tenho interesse em um site.',
  hi: 'नमस्ते Jorge, मैंने आपका पेज देखा और मुझे वेबसाइट बनवानी है।',
};
const FORM_STRINGS: Record<Lang, FormStrings> = {
  en: {
    namePh: 'Your name',
    emailPh: 'Your email',
    messagePh: 'What do you do, and what do you need? (a few words is fine)',
    send: 'Send message',
    sending: 'Sending…',
    success: "Got it — I'll get back to you shortly. Thank you!",
    error: "Something went wrong. Please try WhatsApp or call, and I'll make it right.",
  },
  es: {
    namePh: 'Su nombre',
    emailPh: 'Su correo',
    messagePh: '¿A qué se dedica y qué necesita? (con unas palabras basta)',
    send: 'Enviar mensaje',
    sending: 'Enviando…',
    success: 'Recibido — le respondo muy pronto. ¡Gracias!',
    error: 'Algo salió mal. Escríbame por WhatsApp o llame, y lo resolvemos.',
  },
  pt: {
    namePh: 'Seu nome',
    emailPh: 'Seu e-mail',
    messagePh: 'O que você faz e do que precisa? (algumas palavras já bastam)',
    send: 'Enviar mensagem',
    sending: 'Enviando…',
    success: 'Recebido — respondo pra você em breve. Obrigado!',
    error: 'Algo deu errado. Chama no WhatsApp ou liga, e a gente resolve.',
  },
  hi: {
    namePh: 'आपका नाम',
    emailPh: 'आपका ईमेल',
    messagePh: 'आप क्या करते हैं और क्या चाहिए? (दो-चार शब्द ही काफ़ी हैं)',
    send: 'मैसेज भेजें',
    sending: 'भेज रहे हैं…',
    success: 'मिल गया — मैं जल्दी ही आपसे संपर्क करूँगा। धन्यवाद!',
    error: 'कुछ गड़बड़ हो गई। WhatsApp या कॉल करें, मैं सब ठीक कर दूँगा।',
  },
};
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
  private readonly platformId = inject(PLATFORM_ID);
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

  readonly waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGES.en)}`;
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
