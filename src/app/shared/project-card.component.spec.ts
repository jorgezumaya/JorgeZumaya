import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ProjectCardComponent } from './project-card.component';
import type { Project } from './projects.data';

const project: Project = {
  slug: 'test-project',
  title: 'Test Project',
  description: 'A project used for testing.',
  stack: ['TypeScript'],
  featured: false,
};

describe('ProjectCardComponent', () => {
  let component: ProjectCardComponent;
  let fixture: ComponentFixture<ProjectCardComponent>;
  let card: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectCardComponent);
    fixture.componentRef.setInput('project', project);
    component = fixture.componentInstance;
    fixture.detectChanges();

    card = fixture.nativeElement;
    card.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 100 }) as DOMRect;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply a tilt transform on pointer move', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: false } as MediaQueryList);

    component.onTilt({ clientX: 100, clientY: 100, currentTarget: card } as unknown as MouseEvent);

    expect(card.style.transform).toContain('perspective(700px)');
    expect(card.style.transform).toContain('rotateX');
    expect(card.style.transform).toContain('rotateY');
  });

  it('should not tilt when the user prefers reduced motion', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList);

    component.onTilt({ clientX: 100, clientY: 100, currentTarget: card } as unknown as MouseEvent);

    expect(card.style.transform).toBe('');
  });

  it('should clear the transform on resetTilt', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: false } as MediaQueryList);
    component.onTilt({ clientX: 100, clientY: 100, currentTarget: card } as unknown as MouseEvent);
    expect(card.style.transform).not.toBe('');

    component.resetTilt({ currentTarget: card } as unknown as MouseEvent);

    expect(card.style.transform).toBe('');
  });
});
