import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LunesComponent } from './lunes.component';

describe('LunesComponent', () => {
  let component: LunesComponent;
  let fixture: ComponentFixture<LunesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LunesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LunesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
