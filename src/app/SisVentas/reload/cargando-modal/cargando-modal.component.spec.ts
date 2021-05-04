import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargandoModalComponent } from './cargando-modal.component';

describe('CargandoModalComponent', () => {
  let component: CargandoModalComponent;
  let fixture: ComponentFixture<CargandoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargandoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargandoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
