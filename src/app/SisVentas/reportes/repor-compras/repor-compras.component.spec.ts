import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporComprasComponent } from './repor-compras.component';

describe('ReporComprasComponent', () => {
  let component: ReporComprasComponent;
  let fixture: ComponentFixture<ReporComprasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporComprasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
