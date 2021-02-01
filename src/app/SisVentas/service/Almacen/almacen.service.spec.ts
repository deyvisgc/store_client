import { TestBed } from '@angular/core/testing';

import { AlmacenService } from './almacen.service';

describe('AlmacenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlmacenService = TestBed.get(AlmacenService);
    expect(service).toBeTruthy();
  });
});
