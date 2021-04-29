import { TestBed } from '@angular/core/testing';

import { DisplayreportServiceService } from './displayreport-service.service';

describe('DisplayreportServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DisplayreportServiceService = TestBed.get(DisplayreportServiceService);
    expect(service).toBeTruthy();
  });
});
