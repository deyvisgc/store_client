import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CSeleccionarProductosComponent } from './c-seleccionar-productos.component';

describe('CSeleccionarProductosComponent', () => {
  let component: CSeleccionarProductosComponent;
  let fixture: ComponentFixture<CSeleccionarProductosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CSeleccionarProductosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CSeleccionarProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
