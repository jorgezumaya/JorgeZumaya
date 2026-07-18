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
    mockGalleryService.loading.set(false);
    mockGalleryService.photos.set([]);

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

  it('should show a skeleton grid while loading', () => {
    mockGalleryService.loading.set(true);
    fixture.detectChanges();
    const skeletons = fixture.nativeElement.querySelectorAll('.skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should show an empty state when not loading and there are no photos', () => {
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.grid')).toBeFalsy();
    expect(el.textContent).toContain('Photos coming soon.');
  });

  it('should render photo grid when photos are present', () => {
    mockGalleryService.photos.set([
      {
        id: '1',
        storagePath: 'Gallery/1.jpg',
        caption: 'Test photo',
        takenAt: new Date(),
        order: 0,
        tags: [],
        url: 'https://example.com/1.jpg',
        thumbUrl: 'https://example.com/1-thumb.jpg',
      },
    ]);
    fixture.detectChanges();
    const grid = fixture.nativeElement.querySelector('.grid');
    expect(grid).toBeTruthy();
    expect(grid.querySelectorAll('.tile').length).toBe(1);
  });
});
