import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CortesxdiaComponent } from './cortesxdia.component';

describe('CortesxdiaComponent', () => {
  let component: CortesxdiaComponent;
  let fixture: ComponentFixture<CortesxdiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CortesxdiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CortesxdiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
