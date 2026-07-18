import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { PhotoModalComponent } from './photo-modal.component';
import type { Photo } from '../../core/services/gallery.service';

const photo: Photo = {
  id: '1',
  storagePath: 'Gallery/1.jpg',
  caption: 'Test photo',
  takenAt: new Date('2026-01-15'),
  order: 0,
  tags: [],
  url: 'https://example.com/1.jpg',
  thumbUrl: 'https://example.com/1-thumb.jpg',
};

describe('PhotoModalComponent', () => {
  let component: PhotoModalComponent;
  let fixture: ComponentFixture<PhotoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoModalComponent);
    fixture.componentRef.setInput('photo', photo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the photo caption', () => {
    const caption: HTMLElement = fixture.nativeElement.querySelector('.modal__caption-text');
    expect(caption.textContent).toContain('Test photo');
  });

  it('should emit close when the overlay backdrop is clicked', () => {
    const closeSpy = vi.fn();
    component.close.subscribe(closeSpy);

    fixture.nativeElement.querySelector('.overlay').click();

    expect(closeSpy).toHaveBeenCalledOnce();
  });

  it('should emit close when the close button is clicked', () => {
    const closeSpy = vi.fn();
    component.close.subscribe(closeSpy);

    fixture.nativeElement.querySelector('.close-btn').click();

    expect(closeSpy).toHaveBeenCalled();
  });

  it('should not emit close when the modal figure itself is clicked', () => {
    const closeSpy = vi.fn();
    component.close.subscribe(closeSpy);

    fixture.nativeElement.querySelector('.modal').click();

    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('should emit close on the escape key', () => {
    const closeSpy = vi.fn();
    component.close.subscribe(closeSpy);

    component.onEscape();

    expect(closeSpy).toHaveBeenCalledOnce();
  });
});
