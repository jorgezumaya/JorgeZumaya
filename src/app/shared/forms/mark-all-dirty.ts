import { FormGroup } from '@angular/forms';

export function markAllDirty(form: FormGroup): void {
  Object.values(form.controls).forEach((control) => control.markAsDirty());
}
