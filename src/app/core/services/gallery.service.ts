import { inject, Injectable, signal } from '@angular/core';
import { Firestore, collection, query, orderBy, getDocs } from '@angular/fire/firestore';
import { Storage, ref, getDownloadURL } from '@angular/fire/storage';

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
  private firestore = inject(Firestore);
  private storage = inject(Storage);

  photos = signal<Photo[]>([]);
  loading = signal(false);

  async load(): Promise<void> {
    this.loading.set(true);
    try {
      const q = query(collection(this.firestore, 'gallery'), orderBy('order', 'asc'));
      const snap = await getDocs(q);
      const photos = await Promise.all(
        snap.docs.map(async (d) => {
          const data = d.data() as Omit<Photo, 'id' | 'url' | 'thumbUrl'>;
          const largePath = data.storagePath.replace('original/', 'large/').replace(/\.(jpg|jpeg|png)$/i, '.webp');
          const thumbPath = data.storagePath.replace('original/', 'thumb/').replace(/\.(jpg|jpeg|png)$/i, '.webp');
          const [url, thumbUrl] = await Promise.all([
            getDownloadURL(ref(this.storage, largePath)).catch(() => ''),
            getDownloadURL(ref(this.storage, thumbPath)).catch(() => ''),
          ]);
          return { id: d.id, ...data, url, thumbUrl };
        })
      );
      this.photos.set(photos);
    } finally {
      this.loading.set(false);
    }
  }
}
