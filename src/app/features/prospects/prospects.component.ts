import { Component, ElementRef, OnDestroy, PLATFORM_ID, afterNextRender, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type Lang = 'en' | 'es';

const FONT_LINK_ID = 'app-prospects-fonts';
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

  constructor() {
    afterNextRender(() => {
      this.loadFonts();
      this.buildTiles();
      window.addEventListener('resize', this.onResize);

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduceMotion) {
        this.tileInterval = setInterval(() => this.animateRandomTile(), TILE_INTERVAL_MS);
      }
    });
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.onResize);
    }
    clearInterval(this.tileInterval);
  }

  scrollToSection(event: Event, id: string): void {
    event.preventDefault();
    this.host.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  setLang(lang: Lang): void {
    this.host.querySelectorAll<HTMLElement>('[data-en]').forEach((el) => {
      const val = el.getAttribute(`data-${lang}`);
      if (val !== null) el.innerHTML = val;
    });
    this.host.querySelector('#btn-en')?.classList.toggle('active', lang === 'en');
    this.host.querySelector('#btn-es')?.classList.toggle('active', lang === 'es');
    document.documentElement.lang = lang;
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
      'https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700&family=Archivo+Black&family=IBM+Plex+Mono:wght@400;500&display=swap';

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
