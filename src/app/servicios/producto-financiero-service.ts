import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { ProductoFinancieroDTO } from '../DTO/ProductoFinancieroDTO';
import { ProductoMapper } from '../mapper/ProductoMapper';
import { ProductoFinanciero } from '../Modelos/ProductoFinanciero';
import { ApiResponse } from '../Modelos/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export class ProductoFinancieroService {
  private pathObtenerProductos: string = "http://localhost:3002/bp/products"
  private pathAgregarProducto: string = "http://localhost:3002/bp/products"

  constructor(private http: HttpClient) { }

  obtenerProductosFinancieros(): Observable<ProductoFinanciero[]> {
    return this.http.get<ApiResponse<ProductoFinancieroDTO[]>>(this.pathObtenerProductos).pipe(
      map(res => res.data.map(dto => ProductoMapper.transformarAProducto(dto))),
      catchError(err => {
        console.error('Error al obtener lista productos:', err);
        return throwError(() => err);
      })
    );
  }

  verificarId(id: string): Observable<Boolean> {
    return this.http.get<Boolean>(`http://localhost:3002/bp/products/verification/${id}`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  agregarProducto(producto: ProductoFinancieroDTO) {
    return this.http.post<ApiResponse<ProductoFinanciero>>(this.pathAgregarProducto, producto);
  }

  editarProducto(idProducto: string, producto: ProductoFinancieroDTO) {
    return this.http.put<ApiResponse<ProductoFinanciero>>(`http://localhost:3002/bp/products/${idProducto}`, producto);
  }

  eliminarProducto(idProducto: string) {
    return this.http.delete<ApiResponse<void>>(`http://localhost:3002/bp/products/${idProducto}`
    );
  }

}
