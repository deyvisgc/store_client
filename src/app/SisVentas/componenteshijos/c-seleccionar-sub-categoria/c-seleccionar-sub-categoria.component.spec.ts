import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CSeleccionarSubCategoriaComponent } from './c-seleccionar-sub-categoria.component';

describe('CSeleccionarSubCategoriaComponent', () => {
  let component: CSeleccionarSubCategoriaComponent;
  let fixture: ComponentFixture<CSeleccionarSubCategoriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CSeleccionarSubCategoriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CSeleccionarSubCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
