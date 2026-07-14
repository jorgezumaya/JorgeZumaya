import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../../core/services/contact.service';
import { SOCIAL_LINKS } from '../../shared/constants';
import { createToast } from '../../shared/forms/toast';
import { noLinks } from '../../shared/forms/validators';
import { fieldError } from '../../shared/forms/field-error';
import { markAllDirty } from '../../shared/forms/mark-all-dirty';

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
  private readonly toastState = createToast(4000);
  sending = signal(false);
  readonly toast = this.toastState.toast;

  readonly MESSAGE_MAX = 2000;
  readonly social = SOCIAL_LINKS;

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

  fieldError(field: 'name' | 'email' | 'subject' | 'message') {
    return fieldError(this.form.controls[field]);
  }

  async submit() {
    this.form.markAllAsTouched();
    markAllDirty(this.form);
    if (this.form.invalid || this.form.value.website) return;
    this.sending.set(true);
    try {
      const { website, ...payload } = this.form.getRawValue();
      await this.svc.submit(payload);
      this.form.reset();
      this.toastState.show('success');
    } catch (err) {
      console.error('[contact] error:', err);
      this.toastState.show('error');
    } finally {
      this.sending.set(false);
    }
  }
}
