import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ContactComponent } from './contact.component';
import { ContactService } from '../../core/services/contact.service';

const mockContactService = {
  submit: vi.fn().mockResolvedValue(undefined),
};

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [{ provide: ContactService, useValue: mockContactService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    expect(component.form.value).toEqual({
      name: '',
      email: '',
      subject: '',
      message: '',
      website: '',
    });
  });

  it('should be invalid when required fields are empty', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('should not call service when form is invalid', async () => {
    mockContactService.submit.mockClear();
    await component.submit();
    expect(mockContactService.submit).not.toHaveBeenCalled();
  });

  it('should call service and reset form on valid submit', async () => {
    mockContactService.submit.mockClear();
    component.form.setValue({
      name: 'Jorge',
      email: 'jorge@example.com',
      subject: 'Hello',
      message: 'This is a test message.',
      website: '',
    });
    await component.submit();
    expect(mockContactService.submit).toHaveBeenCalledWith({
      name: 'Jorge',
      email: 'jorge@example.com',
      subject: 'Hello',
      message: 'This is a test message.',
    });
    expect(component.sent()).toBe(true);
  });
});
