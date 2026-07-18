import { vi } from 'vitest';
import { LANG_STORAGE_KEY, initialLang } from './prospects-i18n';

function setLanguages(languages: string[]): void {
  Object.defineProperty(window.navigator, 'languages', { value: languages, configurable: true });
  Object.defineProperty(window.navigator, 'language', {
    value: languages[0] ?? 'en',
    configurable: true,
  });
}

describe('initialLang', () => {
  beforeEach(() => {
    localStorage.clear();
    setLanguages(['en-US']);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return the saved language when it is valid', () => {
    localStorage.setItem(LANG_STORAGE_KEY, 'es');
    expect(initialLang()).toBe('es');
  });

  it('should ignore an invalid saved value and fall through to browser detection', () => {
    localStorage.setItem(LANG_STORAGE_KEY, 'fr');
    setLanguages(['pt-BR']);
    expect(initialLang()).toBe('pt');
  });

  it.each([
    ['es-MX', 'es'],
    ['pt-BR', 'pt'],
    ['hi-IN', 'hi'],
    ['en-GB', 'en'],
  ])('should detect %s as %s from navigator.languages', (locale, expected) => {
    setLanguages([locale]);
    expect(initialLang()).toBe(expected);
  });

  it('should default to English when no supported language matches', () => {
    setLanguages(['fr-FR', 'de-DE']);
    expect(initialLang()).toBe('en');
  });

  it('should fall through to browser detection when localStorage throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    setLanguages(['es-ES']);
    expect(initialLang()).toBe('es');
  });
});
