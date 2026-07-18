import { FormControl } from '@angular/forms';
import { noLinks } from './validators';

describe('noLinks', () => {
  it('should allow plain text with no links', () => {
    expect(noLinks(new FormControl('Interested in a new website'))).toBeNull();
  });

  it('should allow an empty or null value', () => {
    expect(noLinks(new FormControl(''))).toBeNull();
    expect(noLinks(new FormControl(null))).toBeNull();
  });

  it('should flag http(s) links', () => {
    expect(noLinks(new FormControl('check out http://example.com'))).toEqual({ noLinks: true });
    expect(noLinks(new FormControl('check out https://example.com'))).toEqual({ noLinks: true });
  });

  it('should flag bare www. links', () => {
    expect(noLinks(new FormControl('visit www.example.com'))).toEqual({ noLinks: true });
  });

  it('should be case-insensitive', () => {
    expect(noLinks(new FormControl('HTTPS://EXAMPLE.COM'))).toEqual({ noLinks: true });
  });
});
