import { TestBed } from '@angular/core/testing';

import { AumentarStockService } from './aumentar-stock.service';

describe('AumentarStockService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AumentarStockService = TestBed.get(AumentarStockService);
    expect(service).toBeTruthy();
  });
});
