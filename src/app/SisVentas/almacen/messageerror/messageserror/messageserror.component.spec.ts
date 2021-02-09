import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageserrorComponent } from './messageserror.component';

describe('MessageserrorComponent', () => {
  let component: MessageserrorComponent;
  let fixture: ComponentFixture<MessageserrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageserrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageserrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
