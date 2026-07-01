import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionTrabajadores } from './gestion-trabajadores';

describe('GestionTrabajadores', () => {
  let component: GestionTrabajadores;
  let fixture: ComponentFixture<GestionTrabajadores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionTrabajadores],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionTrabajadores);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

