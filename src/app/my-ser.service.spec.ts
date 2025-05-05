import { TestBed } from '@angular/core/testing';

import { MySerService } from './my-ser.service';

describe('MySerService', () => {
  let service: MySerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MySerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
