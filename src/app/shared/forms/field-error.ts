import { AbstractControl } from '@angular/forms';

/** Table-driven validation message lookup, shared across reactive forms. */
export function fieldError(control: AbstractControl): string | null {
  if (!control.dirty || control.valid) return null;
  if (control.hasError('required')) return 'This field is required.';
  if (control.hasError('email')) return 'Please enter a valid email address.';
  if (control.hasError('noLinks')) return 'Links are not permitted in the subject line.';
  if (control.hasError('minlength')) {
    return `Message must be at least ${control.getError('minlength').requiredLength} characters.`;
  }
  if (control.hasError('maxlength')) {
    return `Message cannot exceed ${control.getError('maxlength').requiredLength} characters.`;
  }
  return null;
}
