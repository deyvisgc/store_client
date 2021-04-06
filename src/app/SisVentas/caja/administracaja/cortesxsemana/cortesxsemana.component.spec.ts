import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CortesxsemanaComponent } from './cortesxsemana.component';

describe('CortesxsemanaComponent', () => {
  let component: CortesxsemanaComponent;
  let fixture: ComponentFixture<CortesxsemanaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CortesxsemanaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CortesxsemanaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
