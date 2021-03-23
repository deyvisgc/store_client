import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProductosMasCompradosComponent } from './list-productos-mas-comprados.component';

describe('ListProductosMasCompradosComponent', () => {
  let component: ListProductosMasCompradosComponent;
  let fixture: ComponentFixture<ListProductosMasCompradosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListProductosMasCompradosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListProductosMasCompradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
