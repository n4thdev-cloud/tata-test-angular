import { Injectable } from '@angular/core';
import { ProductoFinanciero } from '../Modelos/ProductoFinanciero';

@Injectable({
  providedIn: 'root'
})
export class ProductoStore {
  private productoEditar?: ProductoFinanciero;

  setProducto(producto: ProductoFinanciero) {
    this.productoEditar = producto;
  }

  getProducto(): ProductoFinanciero | undefined {
    return this.productoEditar;
  }

  clear() {
    this.productoEditar = undefined;
  }
}


