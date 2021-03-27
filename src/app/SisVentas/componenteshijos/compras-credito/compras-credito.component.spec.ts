import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasCreditoComponent } from './compras-credito.component';

describe('ComprasCreditoComponent', () => {
  let component: ComprasCreditoComponent;
  let fixture: ComponentFixture<ComprasCreditoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprasCreditoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprasCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
