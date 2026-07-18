import { FormControl, FormGroup } from '@angular/forms';
import { markAllDirty } from './mark-all-dirty';

describe('markAllDirty', () => {
  it('should mark every control in the group as dirty', () => {
    const form = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
    });

    expect(form.controls.name.dirty).toBe(false);
    expect(form.controls.email.dirty).toBe(false);

    markAllDirty(form);

    expect(form.controls.name.dirty).toBe(true);
    expect(form.controls.email.dirty).toBe(true);
  });

  it('should be a no-op on a group with no controls', () => {
    const form = new FormGroup({});
    expect(() => markAllDirty(form)).not.toThrow();
  });
});
