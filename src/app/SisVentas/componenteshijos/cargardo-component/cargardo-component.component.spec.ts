import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargardoComponentComponent } from './cargardo-component.component';

describe('CargardoComponentComponent', () => {
  let component: CargardoComponentComponent;
  let fixture: ComponentFixture<CargardoComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargardoComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargardoComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
