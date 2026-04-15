import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../../core/services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section class="page">
      <div class="grid">
        <div>
          <h1>Let's talk.</h1>
          <ul class="direct">
            <li><a href="mailto:jorge.juarez87@me.com">jorge.juarez87&#64;me.com</a></li>
            <li><a href="https://www.linkedin.com/in/jorgezumaya/" target="_blank" rel="noopener">LinkedIn</a></li>
          </ul>
        </div>
        <form [formGroup]="form" (ngSubmit)="submit()" class="form">
          <label>Name<input formControlName="name" /></label>
          <label>Email<input type="email" formControlName="email" /></label>
          <label>Subject<input formControlName="subject" /></label>
          <label>Message<textarea formControlName="message" rows="6"></textarea></label>
          <!-- honeypot -->
          <input type="text" formControlName="website" class="honeypot" tabindex="-1" autocomplete="off" />
          <button type="submit" [disabled]="form.invalid || sending()">
            {{ sending() ? 'Sending…' : 'Send message' }}
          </button>
          @if (sent()) { <p class="success">Thanks — I'll get back to you soon.</p> }
        </form>
      </div>
    </section>
  `,
  styles: [`
    .page { max-width: var(--container-max); margin: 0 auto; padding: var(--space-16) var(--container-pad); }
    h1 { font-family: var(--font-display); font-size: clamp(2.5rem, 6vw, 5rem); letter-spacing: -0.03em; margin-bottom: var(--space-8); }
    .grid { display: grid; gap: var(--space-12); grid-template-columns: 1fr; }
    @media (min-width: 768px) { .grid { grid-template-columns: 1fr 1fr; } }
    .direct { list-style: none; font-family: var(--font-mono); }
    .direct li { margin-bottom: var(--space-2); }
    .form { display: flex; flex-direction: column; gap: var(--space-4); }
    label { display: flex; flex-direction: column; gap: var(--space-2); font-family: var(--font-mono); font-size: 0.85rem; color: var(--color-text-mute); }
    input, textarea { padding: var(--space-3); background: var(--color-surface); border: 1px solid var(--color-border); color: var(--color-text); border-radius: var(--radius-sm); font-family: var(--font-body); }
    input:focus, textarea:focus { outline: none; border-color: var(--color-accent); }
    button { padding: var(--space-4); background: var(--color-accent); color: var(--color-bg); font-weight: 500; border-radius: var(--radius-sm); }
    button:disabled { opacity: 0.5; }
    .honeypot { position: absolute; left: -9999px; }
    .success { color: var(--color-accent); font-family: var(--font-mono); }
  `],
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
