import { FormControl, Validators } from '@angular/forms';
import { fieldError } from './field-error';

describe('fieldError', () => {
  it('should return null when the control is not dirty', () => {
    const control = new FormControl('', Validators.required);
    expect(fieldError(control)).toBeNull();
  });

  it('should return null when the control is valid', () => {
    const control = new FormControl('jorge@example.com', Validators.email);
    control.markAsDirty();
    expect(fieldError(control)).toBeNull();
  });

  it('should report a required error', () => {
    const control = new FormControl('', Validators.required);
    control.markAsDirty();
    expect(fieldError(control)).toBe('This field is required.');
  });

  it('should report an email error', () => {
    const control = new FormControl('not-an-email', Validators.email);
    control.markAsDirty();
    expect(fieldError(control)).toBe('Please enter a valid email address.');
  });

  it('should report a noLinks error', () => {
    const control = new FormControl('check out https://spam.example');
    control.setErrors({ noLinks: true });
    control.markAsDirty();
    expect(fieldError(control)).toBe('Links are not permitted in the subject line.');
  });

  it('should report a minlength error with the required length', () => {
    const control = new FormControl('hi', Validators.minLength(10));
    control.markAsDirty();
    expect(fieldError(control)).toBe('Message must be at least 10 characters.');
  });

  it('should report a maxlength error with the required length', () => {
    const control = new FormControl('x'.repeat(20), Validators.maxLength(10));
    control.markAsDirty();
    expect(fieldError(control)).toBe('Message cannot exceed 10 characters.');
  });

  it('should prioritize required over other errors', () => {
    const control = new FormControl('', [Validators.required, Validators.email]);
    control.markAsDirty();
    expect(fieldError(control)).toBe('This field is required.');
  });
});
