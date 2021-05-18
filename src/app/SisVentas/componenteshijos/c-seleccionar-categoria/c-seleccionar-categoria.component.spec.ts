import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CSeleccionarCategoriaComponent } from './c-seleccionar-categoria.component';

describe('CSeleccionarCategoriaComponent', () => {
  let component: CSeleccionarCategoriaComponent;
  let fixture: ComponentFixture<CSeleccionarCategoriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CSeleccionarCategoriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CSeleccionarCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
