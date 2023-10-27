import { TestBed } from '@angular/core/testing';

import { SearchspecService } from './searchspec.service';

describe('SearchspecService', () => {
  let service: SearchspecService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchspecService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
