import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MartesComponent } from './martes.component';

describe('MartesComponent', () => {
  let component: MartesComponent;
  let fixture: ComponentFixture<MartesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MartesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MartesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
