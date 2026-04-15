import { Component, inject, OnInit } from '@angular/core';
import { GalleryService } from '../../core/services/gallery.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent implements OnInit {
  svc = inject(GalleryService);
  ngOnInit() { this.svc.load(); }
}
