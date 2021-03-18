import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectclientesComponent } from './selectclientes.component';

describe('SelectclientesComponent', () => {
  let component: SelectclientesComponent;
  let fixture: ComponentFixture<SelectclientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectclientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectclientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
