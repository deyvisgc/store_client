import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiercolesComponent } from './miercoles.component';

describe('MiercolesComponent', () => {
  let component: MiercolesComponent;
  let fixture: ComponentFixture<MiercolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiercolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiercolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
