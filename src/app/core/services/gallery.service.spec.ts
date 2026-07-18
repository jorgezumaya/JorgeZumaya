import { TestBed } from '@angular/core/testing';
import { Storage } from '@angular/fire/storage';
import { vi } from 'vitest';
import { GalleryService } from './gallery.service';

const { listAllMock, getDownloadURLMock } = vi.hoisted(() => ({
  listAllMock: vi.fn(),
  getDownloadURLMock: vi.fn(),
}));

vi.mock('@angular/fire/storage', async () => {
  const actual = await vi.importActual<typeof import('@angular/fire/storage')>(
    '@angular/fire/storage',
  );
  return {
    ...actual,
    ref: vi.fn().mockReturnValue({ fullPath: 'Gallery' }),
    listAll: listAllMock,
    getDownloadURL: getDownloadURLMock,
  };
});

describe('GalleryService', () => {
  let service: GalleryService;

  beforeEach(() => {
    listAllMock.mockReset();
    getDownloadURLMock.mockReset();

    TestBed.configureTestingModule({
      providers: [{ provide: Storage, useValue: {} }],
    });
    service = TestBed.inject(GalleryService);
  });

  it('should start with no photos and not loading', () => {
    expect(service.photos()).toEqual([]);
    expect(service.loading()).toBe(false);
  });

  it('should load photos from Storage with formatted captions, in listing order', async () => {
    listAllMock.mockResolvedValue({
      items: [
        { name: 'JorgeFidDayPic.jpeg', fullPath: 'Gallery/JorgeFidDayPic.jpeg' },
        { name: 'Beach_Trip.png', fullPath: 'Gallery/Beach_Trip.png' },
      ],
    });
    getDownloadURLMock.mockImplementation((item: { name: string }) =>
      Promise.resolve(`https://example.com/${item.name}`),
    );

    await service.load();

    expect(service.photos()).toEqual([
      expect.objectContaining({
        id: 'JorgeFidDayPic.jpeg',
        caption: 'Jorge Fid Day Pic',
        order: 0,
        url: 'https://example.com/JorgeFidDayPic.jpeg',
      }),
      expect.objectContaining({
        id: 'Beach_Trip.png',
        caption: 'Beach Trip',
        order: 1,
        url: 'https://example.com/Beach_Trip.png',
      }),
    ]);
    expect(service.loading()).toBe(false);
  });

  it('should set loading true while the request is in flight', async () => {
    let resolveListAll!: (value: { items: unknown[] }) => void;
    listAllMock.mockReturnValue(
      new Promise((resolve) => {
        resolveListAll = resolve;
      }),
    );

    const loadPromise = service.load();
    expect(service.loading()).toBe(true);

    resolveListAll({ items: [] });
    await loadPromise;

    expect(service.loading()).toBe(false);
  });
});
