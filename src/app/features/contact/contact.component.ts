import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ContactService } from '../../core/services/contact.service';

const URL_PATTERN = /https?:\/\/|www\./i;

function noLinks(control: AbstractControl): ValidationErrors | null {
  return URL_PATTERN.test(control.value ?? '') ? { noLinks: true } : null;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  private svc = inject(ContactService);
  sending = signal(false);
  toast = signal<'success' | 'error' | null>(null);

  readonly MESSAGE_MAX = 2000;

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required, noLinks]],
    message: [
      '',
      [Validators.required, Validators.minLength(10), Validators.maxLength(this.MESSAGE_MAX)],
    ],
    website: [''], // honeypot
  });

  get messageLen() {
    return this.form.controls.message.value.length;
  }

  fieldError(field: 'name' | 'email' | 'subject' | 'message'): string | null {
    const ctrl = this.form.controls[field];
    if (!ctrl.dirty || ctrl.valid) return null;
    if (ctrl.hasError('required')) return 'This field is required.';
    if (ctrl.hasError('email')) return 'Please enter a valid email address.';
    if (ctrl.hasError('noLinks')) return 'Links are not permitted in the subject line.';
    if (ctrl.hasError('minlength')) return 'Message must be at least 10 characters.';
    if (ctrl.hasError('maxlength')) return `Message cannot exceed ${this.MESSAGE_MAX} characters.`;
    return null;
  }

  async submit() {
    this.form.markAllAsTouched();
    this.form.controls.name.markAsDirty();
    this.form.controls.email.markAsDirty();
    this.form.controls.subject.markAsDirty();
    this.form.controls.message.markAsDirty();
    if (this.form.invalid || this.form.value.website) return;
    this.sending.set(true);
    try {
      const { website, ...payload } = this.form.getRawValue();
      await this.svc.submit(payload);
      this.form.reset();
      this.showToast('success');
    } catch (err) {
      console.error('[contact] error:', err);
      this.showToast('error');
    } finally {
      this.sending.set(false);
    }
  }

  private showToast(type: 'success' | 'error') {
    this.toast.set(type);
    setTimeout(() => this.toast.set(null), 4000);
  }
}
