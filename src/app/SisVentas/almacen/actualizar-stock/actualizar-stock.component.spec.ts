import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarStockComponent } from './actualizar-stock.component';

describe('ActualizarStockComponent', () => {
  let component: ActualizarStockComponent;
  let fixture: ComponentFixture<ActualizarStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActualizarStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualizarStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
