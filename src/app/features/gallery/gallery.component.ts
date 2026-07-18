import { Component, inject, OnInit, signal } from '@angular/core';
import { GalleryService, Photo } from '../../core/services/gallery.service';
import { PhotoModalComponent } from './photo-modal.component';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { PageHeaderComponent } from '../../shared/ui/page-header.component';
import { injectIsBrowser } from '../../shared/utils/platform';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [PhotoModalComponent, RevealDirective, PageHeaderComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent implements OnInit {
  svc = inject(GalleryService);
  selectedPhoto = signal<Photo | null>(null);
  private isBrowser = injectIsBrowser();
  readonly skeletons = [1, 2, 3, 4, 5, 6];

  ngOnInit(): void {
    if (this.isBrowser) {
      this.svc.load();
    }
  }

  open(photo: Photo): void {
    this.selectedPhoto.set(photo);
  }

  closeModal(): void {
    this.selectedPhoto.set(null);
  }
}
