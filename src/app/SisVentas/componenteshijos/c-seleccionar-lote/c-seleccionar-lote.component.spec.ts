import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CSeleccionarLoteComponent } from './c-seleccionar-lote.component';

describe('CSeleccionarLoteComponent', () => {
  let component: CSeleccionarLoteComponent;
  let fixture: ComponentFixture<CSeleccionarLoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CSeleccionarLoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CSeleccionarLoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
