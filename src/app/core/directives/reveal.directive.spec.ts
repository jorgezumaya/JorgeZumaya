import { Component, PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { RevealDirective } from './reveal.directive';

@Component({
  standalone: true,
  imports: [RevealDirective],
  template: `<div appReveal></div>`,
})
class HostComponent {}

describe('RevealDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let observeSpy: ReturnType<typeof vi.fn>;
  let unobserveSpy: ReturnType<typeof vi.fn>;
  let disconnectSpy: ReturnType<typeof vi.fn>;
  let capturedCallback: IntersectionObserverCallback | undefined;

  beforeEach(() => {
    observeSpy = vi.fn();
    unobserveSpy = vi.fn();
    disconnectSpy = vi.fn();
    capturedCallback = undefined;

    vi.stubGlobal(
      'IntersectionObserver',
      vi.fn().mockImplementation(function (this: unknown, callback: IntersectionObserverCallback) {
        capturedCallback = callback;
        return {
          observe: observeSpy,
          unobserve: unobserveSpy,
          disconnect: disconnectSpy,
          takeRecords: () => [],
        };
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should observe the host element in the browser', () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(observeSpy).toHaveBeenCalledOnce();
  });

  it('should add is-visible and stop observing once the element intersects', () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement.querySelector('div');
    capturedCallback!(
      [{ isIntersecting: true, target: el } as unknown as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );

    expect(el.classList.contains('is-visible')).toBe(true);
    expect(unobserveSpy).toHaveBeenCalledWith(el);
  });

  it('should not mark non-intersecting entries visible', () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement.querySelector('div');
    capturedCallback!(
      [{ isIntersecting: false, target: el } as unknown as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );

    expect(el.classList.contains('is-visible')).toBe(false);
    expect(unobserveSpy).not.toHaveBeenCalled();
  });

  it('should disconnect the observer on destroy', () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    fixture.destroy();

    expect(disconnectSpy).toHaveBeenCalledOnce();
  });

  it('should mark the element visible immediately during SSR without creating an observer', () => {
    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement.querySelector('div');
    expect(el.classList.contains('is-visible')).toBe(true);
    expect(observeSpy).not.toHaveBeenCalled();
  });
});
