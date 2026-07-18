import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavComponent } from './nav.component';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start closed', () => {
    expect(component.open()).toBe(false);
  });

  it('should close via close()', () => {
    component.open.set(true);
    component.close();
    expect(component.open()).toBe(false);
  });

  it('should close when clicking outside the nav while open', () => {
    component.open.set(true);
    const outside = document.createElement('div');
    component.onDocumentClick({ target: outside } as unknown as Event);
    expect(component.open()).toBe(false);
  });

  it('should stay open when the click originates inside the nav', () => {
    component.open.set(true);
    component.onDocumentClick({ target: fixture.nativeElement } as unknown as Event);
    expect(component.open()).toBe(true);
  });

  it('should ignore outside clicks when already closed', () => {
    component.open.set(false);
    const outside = document.createElement('div');
    component.onDocumentClick({ target: outside } as unknown as Event);
    expect(component.open()).toBe(false);
  });
});
