import { TestBed } from '@angular/core/testing';

import { MarkerDetailsService } from './marker-details.service';

describe('MarkerDetailsService', () => {
  let service: MarkerDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarkerDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
