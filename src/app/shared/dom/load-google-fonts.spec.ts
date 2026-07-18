import { loadGoogleFonts } from './load-google-fonts';

describe('loadGoogleFonts', () => {
  afterEach(() => {
    document.head.innerHTML = '';
  });

  it('should append a stylesheet link with the given id', () => {
    loadGoogleFonts('https://fonts.googleapis.com/css2?family=Archivo', 'test-fonts', []);

    const link = document.getElementById('test-fonts') as HTMLLinkElement;
    expect(link).toBeTruthy();
    expect(link.rel).toBe('stylesheet');
    expect(link.href).toBe('https://fonts.googleapis.com/css2?family=Archivo');
  });

  it('should append preconnect links before the stylesheet', () => {
    loadGoogleFonts('https://fonts.googleapis.com/css2?family=Archivo', 'test-fonts', [
      { href: 'https://fonts.googleapis.com' },
      { href: 'https://fonts.gstatic.com', crossOrigin: true },
    ]);

    const preconnects = Array.from(
      document.head.querySelectorAll<HTMLLinkElement>('link[rel="preconnect"]'),
    );
    expect(preconnects).toHaveLength(2);
    expect(preconnects[0].href).toBe('https://fonts.googleapis.com/');
    expect(preconnects[1].crossOrigin).toBe('anonymous');
  });

  it('should be idempotent for the same link id', () => {
    loadGoogleFonts('https://fonts.googleapis.com/css2?family=Archivo', 'test-fonts', []);
    loadGoogleFonts('https://fonts.googleapis.com/css2?family=Different', 'test-fonts', []);

    expect(document.head.querySelectorAll('#test-fonts')).toHaveLength(1);
    expect((document.getElementById('test-fonts') as HTMLLinkElement).href).toBe(
      'https://fonts.googleapis.com/css2?family=Archivo',
    );
  });
});
