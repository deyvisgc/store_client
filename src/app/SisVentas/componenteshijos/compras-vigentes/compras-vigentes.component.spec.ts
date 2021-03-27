import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasVigentesComponent } from './compras-vigentes.component';

describe('ComprasVigentesComponent', () => {
  let component: ComprasVigentesComponent;
  let fixture: ComponentFixture<ComprasVigentesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprasVigentesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprasVigentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
