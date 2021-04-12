import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArqueocajaComponent } from './arqueocaja.component';

describe('ArqueocajaComponent', () => {
  let component: ArqueocajaComponent;
  let fixture: ComponentFixture<ArqueocajaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArqueocajaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArqueocajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
