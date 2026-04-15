import { Component, inject, OnInit, signal } from '@angular/core';
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

  ngOnInit(): void {
    this.svc.load();
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
