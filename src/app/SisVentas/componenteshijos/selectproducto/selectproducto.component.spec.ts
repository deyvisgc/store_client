import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectproductoComponent } from './selectproducto.component';

describe('SelectproductoComponent', () => {
  let component: SelectproductoComponent;
  let fixture: ComponentFixture<SelectproductoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectproductoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectproductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
