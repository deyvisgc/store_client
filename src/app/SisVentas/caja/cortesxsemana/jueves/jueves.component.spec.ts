import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuevesComponent } from './jueves.component';

describe('JuevesComponent', () => {
  let component: JuevesComponent;
  let fixture: ComponentFixture<JuevesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuevesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuevesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
