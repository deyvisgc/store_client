import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViernesComponent } from './viernes.component';

describe('ViernesComponent', () => {
  let component: ViernesComponent;
  let fixture: ComponentFixture<ViernesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViernesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViernesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
