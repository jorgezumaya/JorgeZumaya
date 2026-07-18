import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SOCIAL_LINKS } from '../../shared/constants';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the current year', () => {
    expect(component.year).toBe(new Date().getFullYear());
  });

  it('should render the current year in the copyright line', () => {
    const copy: HTMLElement = fixture.nativeElement.querySelector('.footer__copy');
    expect(copy.textContent).toContain(String(new Date().getFullYear()));
  });

  it('should link out to the shared social URLs', () => {
    const links: NodeListOf<HTMLAnchorElement> =
      fixture.nativeElement.querySelectorAll('.footer__social a');
    const hrefs = Array.from(links).map((a) => a.getAttribute('href'));
    expect(hrefs).toContain(SOCIAL_LINKS.linkedin);
    expect(hrefs).toContain(SOCIAL_LINKS.github);
    expect(hrefs).toContain(`mailto:${SOCIAL_LINKS.email}`);
  });
});
