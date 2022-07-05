import { TestBed } from '@angular/core/testing';

import { MeterTheaterDBService } from './meter-theater-db.service';

describe('MeterTheaterDBService', () => {
  let service: MeterTheaterDBService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeterTheaterDBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
