import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormproductoComponent } from './formproducto.component';

describe('FormproductoComponent', () => {
  let component: FormproductoComponent;
  let fixture: ComponentFixture<FormproductoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormproductoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormproductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
