import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReloadformComponent } from './reloadform.component';

describe('ReloadformComponent', () => {
  let component: ReloadformComponent;
  let fixture: ComponentFixture<ReloadformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReloadformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReloadformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
