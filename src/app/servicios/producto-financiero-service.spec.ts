import { TestBed } from '@angular/core/testing';
import { ProductoFinancieroService } from './producto-financiero-service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ProductoFinancieroDTO } from '../DTO/ProductoFinancieroDTO';
import { ApiResponse } from '../Modelos/ApiResponse';

describe('ProductoFinancieroService (Angular moderno)', () => {
  let service: ProductoFinancieroService;
  let httpMock: HttpTestingController;

  const mockDTO: ProductoFinancieroDTO = {
    id: '1',
    name: 'Producto Test',
    description: 'Descripción test',
    logo: 'logo.png',
    date_release: '2026-02-01',
    date_revision: '2027-02-01'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductoFinancieroService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ProductoFinancieroService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe obtener y mapear productos', () => {
    const apiResponse: ApiResponse<ProductoFinancieroDTO[]> = {
      data: [mockDTO],
      message: 'ok'
    };

    service.obtenerProductosFinancieros().subscribe(productos => {
      expect(productos.length).toBe(1);
      expect(productos[0].id).toBe('1');
    });

    const req = httpMock.expectOne('http://localhost:3002/bp/products');
    expect(req.request.method).toBe('GET');
    req.flush(apiResponse);
  });

  it('verificarId devuelve false si falla', () => {
    service.verificarId('123').subscribe(res => {
      expect(res).toBe(false);
    });

    const req = httpMock.expectOne('http://localhost:3002/bp/products/verification/123');
    req.flush('Error', { status: 404, statusText: 'Not Found' });
  });

  it('agregarProducto hace POST', () => {
    service.agregarProducto(mockDTO).subscribe();

    const req = httpMock.expectOne('http://localhost:3002/bp/products');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockDTO);
    req.flush({ data: {}, message: 'ok' });
  });

  it('editarProducto hace PUT', () => {
    service.editarProducto('1', mockDTO).subscribe();

    const req = httpMock.expectOne('http://localhost:3002/bp/products/1');
    expect(req.request.method).toBe('PUT');
    req.flush({ data: {}, message: 'ok' });
  });

  it('eliminarProducto hace DELETE', () => {
    service.eliminarProducto('1').subscribe();

    const req = httpMock.expectOne('http://localhost:3002/bp/products/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({ data: null, message: 'ok' });
  });
});
