import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuperarpassordComponent } from './recuperarpassord.component';

describe('RecuperarpassordComponent', () => {
  let component: RecuperarpassordComponent;
  let fixture: ComponentFixture<RecuperarpassordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecuperarpassordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecuperarpassordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
