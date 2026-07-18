import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { ResumeComponent } from './resume.component';
import { ResumeService } from '../../core/services/resume.service';

const mockResumeService = {
  url: signal<string | null>(null),
  loading: signal(false),
  error: signal(false),
  load: vi.fn().mockResolvedValue(undefined),
};

describe('ResumeComponent', () => {
  let component: ResumeComponent;
  let fixture: ComponentFixture<ResumeComponent>;

  beforeEach(async () => {
    mockResumeService.load.mockClear();
    mockResumeService.url.set(null);
    mockResumeService.loading.set(false);
    mockResumeService.error.set(false);

    await TestBed.configureTestingModule({
      imports: [ResumeComponent],
      providers: [provideRouter([]), { provide: ResumeService, useValue: mockResumeService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call svc.load on init', () => {
    expect(mockResumeService.load).toHaveBeenCalledOnce();
  });

  it('should show a loading state before the URL resolves', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Loading resume');
    expect(el.querySelector('iframe')).toBeFalsy();
  });

  it('should render an iframe once the download URL resolves', () => {
    mockResumeService.url.set('https://firebasestorage.googleapis.com/resume.html');
    fixture.detectChanges();

    const iframe: HTMLIFrameElement = fixture.nativeElement.querySelector('iframe');
    expect(iframe).toBeTruthy();
    expect(iframe.getAttribute('title')).toBe('Jorge Zumaya — Resume');
  });

  it('should show an error state with a contact link when loading fails', () => {
    mockResumeService.error.set(true);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('iframe')).toBeFalsy();
    expect(el.textContent).toContain("couldn't be loaded");

    const link: HTMLAnchorElement = el.querySelector('a')!;
    expect(link.getAttribute('routerLink') ?? link.getAttribute('ng-reflect-router-link')).toBe(
      '/contact',
    );
  });

  it('should prefer the iframe over the error state once a URL resolves', () => {
    mockResumeService.error.set(true);
    mockResumeService.url.set('https://firebasestorage.googleapis.com/resume.html');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('iframe')).toBeTruthy();
  });
});
