import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvedorselectComponent } from './provedorselect.component';

describe('ProvedorselectComponent', () => {
  let component: ProvedorselectComponent;
  let fixture: ComponentFixture<ProvedorselectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvedorselectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvedorselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
