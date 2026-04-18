import { Component, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { GalleryService, Photo } from '../../core/services/gallery.service';
import { PhotoModalComponent } from './photo-modal.component';
import { RevealDirective } from '../../core/directives/reveal.directive';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [PhotoModalComponent, RevealDirective],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent implements OnInit {
  svc = inject(GalleryService);
  selectedPhoto = signal<Photo | null>(null);
  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.svc.load();
    }
  }

  open(photo: Photo): void {
    this.selectedPhoto.set(photo);
  }

  closeModal(): void {
    this.selectedPhoto.set(null);
  }

  fakeLikes(order: number): number {
    return order * 7 + 42;
  }
}
