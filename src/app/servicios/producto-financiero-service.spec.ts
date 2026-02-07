import { TestBed } from '@angular/core/testing';

import { ProductoFinancieroService } from './producto-financiero-service';

describe('ProductoFinancieroService', () => {
  let service: ProductoFinancieroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductoFinancieroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
