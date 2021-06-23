import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLoteComponent } from './list-lote.component';

describe('ListLoteComponent', () => {
  let component: ListLoteComponent;
  let fixture: ComponentFixture<ListLoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListLoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
