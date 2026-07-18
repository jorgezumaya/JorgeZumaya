import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { injectIsBrowser } from './platform';

describe('injectIsBrowser', () => {
  it('should return true for the browser platform', () => {
    TestBed.configureTestingModule({});
    const result = TestBed.runInInjectionContext(() => injectIsBrowser());
    expect(result).toBe(true);
  });

  it('should return false for the server platform', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });
    const result = TestBed.runInInjectionContext(() => injectIsBrowser());
    expect(result).toBe(false);
  });
});
