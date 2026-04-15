import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { GalleryComponent } from './gallery.component';
import { GalleryService } from '../../core/services/gallery.service';
import type { Photo } from '../../core/services/gallery.service';

const mockGalleryService = {
  photos: signal<Photo[]>([]),
  loading: signal(false),
  load: vi.fn().mockResolvedValue(undefined),
};

describe('GalleryComponent', () => {
  let component: GalleryComponent;
  let fixture: ComponentFixture<GalleryComponent>;

  beforeEach(async () => {
    mockGalleryService.load.mockClear();

    await TestBed.configureTestingModule({
      imports: [GalleryComponent],
      providers: [{ provide: GalleryService, useValue: mockGalleryService }],
    }).compileComponents();

    fixture = TestBed.createComponent(GalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call svc.load on init', () => {
    expect(mockGalleryService.load).toHaveBeenCalledOnce();
  });

  it('should show loading state while loading', () => {
    mockGalleryService.loading.set(true);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Loading');
  });

  it('should render photo grid when not loading', () => {
    mockGalleryService.loading.set(false);
    fixture.detectChanges();
    const grid = fixture.nativeElement.querySelector('.grid');
    expect(grid).toBeTruthy();
  });
});
