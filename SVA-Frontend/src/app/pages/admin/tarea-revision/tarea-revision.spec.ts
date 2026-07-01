import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TareaRevision } from './tarea-revision';

describe('TareaRevision', () => {
  let component: TareaRevision;
  let fixture: ComponentFixture<TareaRevision>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TareaRevision],
    }).compileComponents();

    fixture = TestBed.createComponent(TareaRevision);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

