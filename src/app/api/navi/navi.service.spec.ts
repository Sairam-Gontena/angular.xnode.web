import { TestBed } from '@angular/core/testing';

import { NaviService } from './navi.service';

describe('NaviService', () => {
  let service: NaviService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NaviService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
