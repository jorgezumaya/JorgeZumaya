import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ExperienceComponent } from './experience.component';

describe('ExperienceComponent', () => {
  let component: ExperienceComponent;
  let fixture: ComponentFixture<ExperienceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperienceComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the page heading', () => {
    const h1: HTMLElement = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toBe('Experience');
  });

  it('should link the resume CTA to /resume', () => {
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('.resume-cta__btn');
    expect(link.getAttribute('routerLink') ?? link.getAttribute('ng-reflect-router-link')).toBe(
      '/resume',
    );
  });
});
