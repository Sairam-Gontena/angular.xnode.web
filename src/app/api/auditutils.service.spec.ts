import { TestBed } from '@angular/core/testing';

import { AuditutilsService } from './auditutils.service';

describe('AuditutilsService', () => {
  let service: AuditutilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditutilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
