import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TareaTrabajador } from './tarea-trabajador';

describe('TareaTrabajador', () => {
  let component: TareaTrabajador;
  let fixture: ComponentFixture<TareaTrabajador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TareaTrabajador],
    }).compileComponents();

    fixture = TestBed.createComponent(TareaTrabajador);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

