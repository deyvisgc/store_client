import { TestBed } from '@angular/core/testing';

import { UnidadMedidaService } from './unidad-medida.service';

describe('UnidadMedidaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UnidadMedidaService = TestBed.get(UnidadMedidaService);
    expect(service).toBeTruthy();
  });
});
