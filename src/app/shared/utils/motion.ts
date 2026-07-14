export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export interface Tilt {
  rotateX: number;
  rotateY: number;
}

/** Rotation for a pointer-following tilt effect, relative to an element's bounding box. */
export function computeTilt(
  clientX: number,
  clientY: number,
  bounds: { left: number; top: number; width: number; height: number },
  strength = 12,
): Tilt {
  const rotateY = ((clientX - bounds.left) / bounds.width - 0.5) * strength;
  const rotateX = ((clientY - bounds.top) / bounds.height - 0.5) * -strength;
  return { rotateX, rotateY };
}
