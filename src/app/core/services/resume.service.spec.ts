import { TestBed } from '@angular/core/testing';
import { Storage } from '@angular/fire/storage';
import { vi } from 'vitest';
import { ResumeService } from './resume.service';

const { refMock, listAllMock, getDownloadURLMock } = vi.hoisted(() => ({
  refMock: vi.fn().mockReturnValue({ fullPath: 'Resume' }),
  listAllMock: vi.fn(),
  getDownloadURLMock: vi.fn(),
}));

vi.mock('@angular/fire/storage', () => ({
  Storage: class {},
  ref: refMock,
  listAll: listAllMock,
  getDownloadURL: getDownloadURLMock,
}));

describe('ResumeService', () => {
  let service: ResumeService;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    listAllMock.mockReset();
    getDownloadURLMock.mockReset();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    TestBed.configureTestingModule({
      providers: [{ provide: Storage, useValue: {} }],
    });
    service = TestBed.inject(ResumeService);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should start with no URL, not loading, no error', () => {
    expect(service.url()).toBeNull();
    expect(service.loading()).toBe(false);
    expect(service.error()).toBe(false);
  });

  it('should resolve the download URL of the first .html file in Storage', async () => {
    listAllMock.mockResolvedValue({
      items: [{ name: 'JorgeZumayaResume2026.pdf' }, { name: 'jorge-zumaya-resume.html' }],
    });
    getDownloadURLMock.mockResolvedValue('https://example.com/jorge-zumaya-resume.html');

    await service.load();

    expect(getDownloadURLMock).toHaveBeenCalledWith({ name: 'jorge-zumaya-resume.html' });
    expect(service.url()).toBe('https://example.com/jorge-zumaya-resume.html');
    expect(service.loading()).toBe(false);
    expect(service.error()).toBe(false);
  });

  it('should set error when no .html file exists in Storage', async () => {
    listAllMock.mockResolvedValue({ items: [{ name: 'JorgeZumayaResume2026.pdf' }] });

    await service.load();

    expect(service.error()).toBe(true);
    expect(service.url()).toBeNull();
    expect(service.loading()).toBe(false);
  });

  it('should set error when listAll rejects', async () => {
    listAllMock.mockRejectedValue(new Error('network down'));

    await service.load();

    expect(service.error()).toBe(true);
    expect(service.url()).toBeNull();
    expect(service.loading()).toBe(false);
  });

  it('should not re-fetch once a URL has already been resolved', async () => {
    listAllMock.mockResolvedValue({ items: [{ name: 'resume.html' }] });
    getDownloadURLMock.mockResolvedValue('https://example.com/resume.html');

    await service.load();
    await service.load();

    expect(listAllMock).toHaveBeenCalledOnce();
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

    resolveListAll({ items: [{ name: 'resume.html' }] });
    getDownloadURLMock.mockResolvedValue('https://example.com/resume.html');
    await loadPromise;

    expect(service.loading()).toBe(false);
  });
});
