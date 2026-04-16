import { inject, Injectable, signal } from '@angular/core';
import { Storage, ref, listAll, getDownloadURL } from '@angular/fire/storage';

export interface Photo {
  id: string;
  storagePath: string;
  caption: string;
  takenAt: Date;
  order: number;
  tags: string[];
  url?: string;
  thumbUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class GalleryService {
  private storage = inject(Storage);

  photos = signal<Photo[]>([]);
  loading = signal(false);

  async load(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await listAll(ref(this.storage, 'Gallery'));
      const photos = await Promise.all(
        result.items.map(async (item, index) => {
          const url = await getDownloadURL(item);
          return {
            id: item.name,
            storagePath: item.fullPath,
            caption: this.formatCaption(item.name),
            takenAt: new Date(),
            order: index,
            tags: [],
            url,
            thumbUrl: url,
          } satisfies Photo;
        }),
      );
      this.photos.set(photos);
    } finally {
      this.loading.set(false);
    }
  }

  /** "JorgeFidDayPic.jpeg" → "Jorge Fid Day Pic" */
  private formatCaption(filename: string): string {
    return filename
      .replace(/\.(jpe?g|png|webp)$/i, '')
      .replace(/_/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .trim();
  }
}
