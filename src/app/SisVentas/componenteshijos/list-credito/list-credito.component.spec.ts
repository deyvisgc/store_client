import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCreditoComponent } from './list-credito.component';

describe('ListCreditoComponent', () => {
  let component: ListCreditoComponent;
  let fixture: ComponentFixture<ListCreditoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCreditoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
