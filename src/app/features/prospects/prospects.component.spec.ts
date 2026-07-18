import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ProspectsComponent } from './prospects.component';
import { ContactService } from '../../core/services/contact.service';

const mockContactService = {
  submit: vi.fn().mockResolvedValue(undefined),
};

describe('ProspectsComponent', () => {
  let component: ProspectsComponent;
  let fixture: ComponentFixture<ProspectsComponent>;

  beforeEach(async () => {
    localStorage.clear();
    mockContactService.submit.mockClear();
    mockContactService.submit.mockResolvedValue(undefined);
    HTMLElement.prototype.scrollIntoView = vi.fn();

    await TestBed.configureTestingModule({
      imports: [ProspectsComponent],
      providers: [{ provide: ContactService, useValue: mockContactService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProspectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to English copy', () => {
    expect(component.lang()).toBe('en');
    expect(component.current().code).toBe('en');
    expect(component.t().send).toBe('Send message');
  });

  it('should build the tel: link from the WhatsApp number', () => {
    expect(component.telHref).toMatch(/^tel:\+\d+$/);
  });

  it('should build a WhatsApp link with the English message encoded', () => {
    expect(component.waHref).toContain('https://wa.me/');
    expect(component.waHref).toContain(encodeURIComponent("Hi Jorge, I saw your page"));
  });

  it('should toggle the language menu open and closed', () => {
    const event = { stopPropagation: vi.fn() } as unknown as Event;

    component.toggleMenu(event);
    expect(component.menuOpen()).toBe(true);
    expect(event.stopPropagation).toHaveBeenCalledOnce();

    component.toggleMenu(event);
    expect(component.menuOpen()).toBe(false);
  });

  it('should switch language and close the menu on choose()', () => {
    component.menuOpen.set(true);

    component.choose('es');

    expect(component.lang()).toBe('es');
    expect(component.menuOpen()).toBe(false);
    expect(localStorage.getItem('prospects-lang')).toBe('es');
  });

  it('should flag a field invalid only once dirty or touched', () => {
    expect(component.fieldInvalid('email')).toBe(false);
    component.form.controls.email.markAsDirty();
    expect(component.fieldInvalid('email')).toBe(true);
    component.form.controls.email.setValue('jorge@example.com');
    expect(component.fieldInvalid('email')).toBe(false);
  });

  it('should not submit when the honeypot field is filled', async () => {
    component.form.setValue({
      name: 'Jorge',
      email: 'jorge@example.com',
      message: 'Interested in a website for my business.',
      website: 'http://spambot.example',
    });

    await component.submit();

    expect(mockContactService.submit).not.toHaveBeenCalled();
  });

  it('should not submit an invalid form', async () => {
    await component.submit();

    expect(mockContactService.submit).not.toHaveBeenCalled();
  });

  it('should submit, reset the form, and show a success toast on valid submit', async () => {
    component.form.setValue({
      name: 'Jorge',
      email: 'jorge@example.com',
      message: 'Interested in a website for my business.',
      website: '',
    });

    await component.submit();

    expect(mockContactService.submit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Jorge',
        email: 'jorge@example.com',
        message: 'Interested in a website for my business.',
        subject: expect.stringContaining('EN'),
      }),
    );
    expect(component.form.value.name).toBeFalsy();
    expect(component.toast()).toBe('success');
    expect(component.sending()).toBe(false);
  });

  it('should show an error toast when the submission fails', async () => {
    mockContactService.submit.mockRejectedValueOnce(new Error('network error'));
    component.form.setValue({
      name: 'Jorge',
      email: 'jorge@example.com',
      message: 'Interested in a website for my business.',
      website: '',
    });

    await component.submit();

    expect(component.toast()).toBe('error');
    expect(component.sending()).toBe(false);
  });

  it('should prevent default and scroll to the target section', () => {
    const section = document.createElement('div');
    section.id = 'test-section';
    fixture.nativeElement.appendChild(section);
    const event = { preventDefault: vi.fn() } as unknown as Event;

    component.scrollToSection(event, 'test-section');

    expect(event.preventDefault).toHaveBeenCalledOnce();
    expect(section.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
  });
});
