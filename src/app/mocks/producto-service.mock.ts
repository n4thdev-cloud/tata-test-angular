import { of } from 'rxjs';
import { ProductoFinanciero } from '../Modelos/ProductoFinanciero';

// Mock de productos financieros
export const mockProductos: ProductoFinanciero[] = [
  new ProductoFinanciero(
    '1',
    'Producto 1',
    'Descripción del producto 1',
    'logo1.png',
    new Date('2026-02-01'),
    new Date('2026-02-10')
  ),
  new ProductoFinanciero(
    '2',
    'Producto 2',
    'Descripción del producto 2',
    'logo2.png',
    new Date('2026-03-01'),
    new Date('2026-03-10')
  ),
  new ProductoFinanciero(
    '3',
    'Producto 3',
    'Descripción del producto 3',
    'logo3.png',
    new Date('2026-04-01'),
    new Date('2026-04-10')
  ),
];

// Mock del servicio ProductoFinancieroService
export class ProductoFinancieroServiceMock {
  obtenerProductosFinancieros() {
    return of(mockProductos);
  }

  eliminarProducto(id: string) {
    return of({ message: 'Producto eliminado correctamente' });
  }
}
