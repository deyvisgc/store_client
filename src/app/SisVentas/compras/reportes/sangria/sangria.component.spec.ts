import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SangriaComponent } from './sangria.component';

describe('SangriaComponent', () => {
  let component: SangriaComponent;
  let fixture: ComponentFixture<SangriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SangriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SangriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
