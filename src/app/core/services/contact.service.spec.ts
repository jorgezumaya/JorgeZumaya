import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ContactService } from './contact.service';

describe('ContactService', () => {
  let service: ContactService;
  let fetchMock: ReturnType<typeof vi.fn>;

  const payload = {
    name: 'Jorge',
    email: 'jorge@example.com',
    subject: 'Hello',
    message: 'This is a test message.',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactService);
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should POST the payload as JSON to /api/contact', async () => {
    fetchMock.mockResolvedValue({ ok: true });

    await service.submit(payload);

    expect(fetchMock).toHaveBeenCalledWith('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  });

  it('should resolve without error when the response is ok', async () => {
    fetchMock.mockResolvedValue({ ok: true });

    await expect(service.submit(payload)).resolves.toBeUndefined();
  });

  it('should throw the server-provided error message when the response is not ok', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: 'Spam detected' }),
    });

    await expect(service.submit(payload)).rejects.toThrow('Spam detected');
  });

  it('should fall back to an HTTP status message when the error body cannot be parsed', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.reject(new Error('not json')),
    });

    await expect(service.submit(payload)).rejects.toThrow('HTTP 500');
  });
});
