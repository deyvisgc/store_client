import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaLotesComponent } from './lista-lotes.component';

describe('ListaLotesComponent', () => {
  let component: ListaLotesComponent;
  let fixture: ComponentFixture<ListaLotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaLotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaLotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
