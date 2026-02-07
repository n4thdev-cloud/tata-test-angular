import { TestBed } from '@angular/core/testing';

import { OkError } from './ok-error';

describe('OkError', () => {
  let service: OkError;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OkError);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
