import { vi } from 'vitest';
import { createToast } from './toast';

describe('createToast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should start with no toast', () => {
    const { toast } = createToast(1000);
    expect(toast()).toBeNull();
  });

  it('should set the toast type on show()', () => {
    const { toast, show } = createToast(1000);
    show('success');
    expect(toast()).toBe('success');
  });

  it('should clear the toast after durationMs', () => {
    const { toast, show } = createToast(1000);
    show('success');

    vi.advanceTimersByTime(999);
    expect(toast()).toBe('success');

    vi.advanceTimersByTime(1);
    expect(toast()).toBeNull();
  });

  it('should restart the timer when shown again before it clears', () => {
    const { toast, show } = createToast(1000);
    show('success');

    vi.advanceTimersByTime(700);
    show('error');
    expect(toast()).toBe('error');

    vi.advanceTimersByTime(700);
    expect(toast()).toBe('error');

    vi.advanceTimersByTime(300);
    expect(toast()).toBeNull();
  });
});
