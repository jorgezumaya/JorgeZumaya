import { signal } from '@angular/core';

export type ToastType = 'success' | 'error';

/** Signal-backed toast that clears itself after `durationMs`. */
export function createToast(durationMs: number) {
  const toast = signal<ToastType | null>(null);
  let timer: ReturnType<typeof setTimeout> | undefined;

  function show(type: ToastType): void {
    toast.set(type);
    clearTimeout(timer);
    timer = setTimeout(() => toast.set(null), durationMs);
  }

  return { toast, show };
}
