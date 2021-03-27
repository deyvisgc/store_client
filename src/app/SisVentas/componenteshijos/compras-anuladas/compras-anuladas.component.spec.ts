import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasAnuladasComponent } from './compras-anuladas.component';

describe('ComprasAnuladasComponent', () => {
  let component: ComprasAnuladasComponent;
  let fixture: ComponentFixture<ComprasAnuladasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprasAnuladasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprasAnuladasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
