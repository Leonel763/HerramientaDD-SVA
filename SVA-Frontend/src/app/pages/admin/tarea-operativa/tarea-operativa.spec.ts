import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TareaOperativa } from './tarea-operativa';

describe('TareaOperativa', () => {
  let component: TareaOperativa;
  let fixture: ComponentFixture<TareaOperativa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TareaOperativa],
    }).compileComponents();

    fixture = TestBed.createComponent(TareaOperativa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

