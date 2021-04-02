import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReloadFiltrosComponent } from './reload-filtros.component';

describe('ReloadFiltrosComponent', () => {
  let component: ReloadFiltrosComponent;
  let fixture: ComponentFixture<ReloadFiltrosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReloadFiltrosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReloadFiltrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
