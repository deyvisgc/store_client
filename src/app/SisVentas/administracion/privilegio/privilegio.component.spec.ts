import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivilegioComponent } from './privilegio.component';

describe('PrivilegioComponent', () => {
  let component: PrivilegioComponent;
  let fixture: ComponentFixture<PrivilegioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivilegioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivilegioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
