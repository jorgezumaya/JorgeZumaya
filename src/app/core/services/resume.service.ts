import { inject, Injectable, signal } from '@angular/core';
import { Storage, ref, listAll, getDownloadURL } from '@angular/fire/storage';

@Injectable({ providedIn: 'root' })
export class ResumeService {
  private storage = inject(Storage);

  url = signal<string | null>(null);
  loading = signal(false);
  error = signal(false);

  async load(): Promise<void> {
    if (this.url() || this.loading()) return;
    this.loading.set(true);
    this.error.set(false);
    try {
      const result = await listAll(ref(this.storage, 'Resume'));
      const file = result.items.find((item) => item.name.toLowerCase().endsWith('.html'));
      if (!file) throw new Error('No resume HTML file found in Storage');
      this.url.set(await getDownloadURL(file));
    } catch (err) {
      console.error('[resume] failed to load resume from Storage:', err);
      this.error.set(true);
    } finally {
      this.loading.set(false);
    }
  }
}
