import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the hero title', () => {
    const h1: HTMLElement = fixture.nativeElement.querySelector('.hero__title');
    expect(h1.textContent).toContain('jorge');
    expect(h1.textContent).toContain('zumaya');
  });

  it('should render links to /work and /contact', () => {
    const links: NodeListOf<HTMLAnchorElement> = fixture.nativeElement.querySelectorAll('a[routerLink]');
    const hrefs = Array.from(links).map((a) => a.getAttribute('routerLink') ?? a.getAttribute('ng-reflect-router-link'));
    expect(hrefs).toContain('/work');
    expect(hrefs).toContain('/contact');
  });
});
