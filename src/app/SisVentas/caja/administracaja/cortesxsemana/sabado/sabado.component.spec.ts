import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SabadoComponent } from './sabado.component';

describe('SabadoComponent', () => {
  let component: SabadoComponent;
  let fixture: ComponentFixture<SabadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SabadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SabadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
