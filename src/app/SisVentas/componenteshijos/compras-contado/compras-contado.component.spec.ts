import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasContadoComponent } from './compras-contado.component';

describe('ComprasContadoComponent', () => {
  let component: ComprasContadoComponent;
  let fixture: ComponentFixture<ComprasContadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprasContadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprasContadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
