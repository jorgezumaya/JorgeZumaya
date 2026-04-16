import { Component, HostListener, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Photo } from '../../core/services/gallery.service';

@Component({
  selector: 'app-photo-modal',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './photo-modal.component.html',
  styleUrl: './photo-modal.component.scss',
})
export class PhotoModalComponent {
  photo = input.required<Photo>();
  close = output<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close.emit();
  }
}
