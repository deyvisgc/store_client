import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomingoComponent } from './domingo.component';

describe('DomingoComponent', () => {
  let component: DomingoComponent;
  let fixture: ComponentFixture<DomingoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomingoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomingoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
