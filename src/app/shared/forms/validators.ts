import { AbstractControl, ValidationErrors } from '@angular/forms';

const URL_PATTERN = /https?:\/\/|www\./i;

export function noLinks(control: AbstractControl): ValidationErrors | null {
  return URL_PATTERN.test(control.value ?? '') ? { noLinks: true } : null;
}
