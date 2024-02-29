import { TestBed } from '@angular/core/testing';

import { SpecificationsService } from './specifications.service';

describe('SpecificationsService', () => {
  let service: SpecificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpecificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
