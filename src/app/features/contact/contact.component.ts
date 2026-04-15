import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../../core/services/contact.service';

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
  sent = signal(false);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]],
    website: [''], // honeypot
  });

  async submit() {
    if (this.form.invalid || this.form.value.website) return;
    this.sending.set(true);
    try {
      const { website, ...payload } = this.form.getRawValue();
      await this.svc.submit(payload);
      this.sent.set(true);
      this.form.reset();
    } finally {
      this.sending.set(false);
    }
  }
}
