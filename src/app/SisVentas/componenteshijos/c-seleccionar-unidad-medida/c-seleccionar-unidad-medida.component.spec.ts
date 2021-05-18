import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CSeleccionarUnidadMedidaComponent } from './c-seleccionar-unidad-medida.component';

describe('CSeleccionarUnidadMedidaComponent', () => {
  let component: CSeleccionarUnidadMedidaComponent;
  let fixture: ComponentFixture<CSeleccionarUnidadMedidaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CSeleccionarUnidadMedidaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CSeleccionarUnidadMedidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
