import { vi } from 'vitest';
import { computeTilt, prefersReducedMotion } from './motion';

describe('prefersReducedMotion', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should reflect the prefers-reduced-motion media query', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList);
    expect(prefersReducedMotion()).toBe(true);
  });

  it('should return false when the query does not match', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: false } as MediaQueryList);
    expect(prefersReducedMotion()).toBe(false);
  });
});

describe('computeTilt', () => {
  const bounds = { left: 0, top: 0, width: 100, height: 100 };

  it('should return zero rotation at the exact center of the bounds', () => {
    const tilt = computeTilt(50, 50, bounds);
    expect(tilt.rotateX).toBeCloseTo(0);
    expect(tilt.rotateY).toBeCloseTo(0);
  });

  it('should rotate toward the pointer on the right/bottom edge', () => {
    const tilt = computeTilt(100, 100, bounds);
    expect(tilt.rotateY).toBeCloseTo(6);
    expect(tilt.rotateX).toBeCloseTo(-6);
  });

  it('should rotate the opposite way on the left/top edge', () => {
    const tilt = computeTilt(0, 0, bounds);
    expect(tilt.rotateY).toBeCloseTo(-6);
    expect(tilt.rotateX).toBeCloseTo(6);
  });

  it('should scale with a custom strength', () => {
    const tilt = computeTilt(100, 50, bounds, 20);
    expect(tilt.rotateY).toBeCloseTo(10);
  });

  it('should account for a non-zero bounds origin', () => {
    const offsetBounds = { left: 50, top: 50, width: 100, height: 100 };
    const tilt = computeTilt(100, 100, offsetBounds);
    expect(tilt.rotateX).toBeCloseTo(0);
    expect(tilt.rotateY).toBeCloseTo(0);
  });
});
