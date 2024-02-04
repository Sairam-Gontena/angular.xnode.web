/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { D3Service } from './D3.service';

describe('Service: D3', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [D3Service]
    });
  });

  it('should ...', inject([D3Service], (service: D3Service) => {
    expect(service).toBeTruthy();
  }));
});
