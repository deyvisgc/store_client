import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracajaComponent } from './administracaja.component';

describe('AdministracajaComponent', () => {
  let component: AdministracajaComponent;
  let fixture: ComponentFixture<AdministracajaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministracajaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
