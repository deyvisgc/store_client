import { TestBed } from '@angular/core/testing';

import { EnviromentService } from './enviroment.service';

describe('EnviromentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnviromentService = TestBed.get(EnviromentService);
    expect(service).toBeTruthy();
  });
});
