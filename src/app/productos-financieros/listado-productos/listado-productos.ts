import { Component } from '@angular/core';
import { ProductoFinancieroService } from '../../servicios/producto-financiero-service';
import { ProductoFinanciero } from '../../Modelos/ProductoFinanciero';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { Agregar } from "../agregar/agregar";
import { ProductoStore } from '../../store/producto-store';
import { ConfirmacionModal } from '../../modal/confirmacion-modal/confirmacion-modal';
import { ConfirmacionError } from '../../mensaje/confirmacion-error/confirmacion-error';
import { OkError } from '../../toast/ok-error';

@Component({
  selector: 'app-listado-productos',
  imports: [CommonModule, Agregar, ConfirmacionModal, ConfirmacionError],
  templateUrl: './listado-productos.html',
  styleUrl: './listado-productos.css',
})
export class ListadoProductos {

  listaProductos: ProductoFinanciero[] = [];
  productosPaginados: ProductoFinanciero[] = [];
  productoSeleccionado: ProductoFinanciero | null = null;
  mostrarMenu = false;
  posX = 0;
  posY = 0;
  mostrarModal = false;
  productoAEliminar!: ProductoFinanciero
  paginaActual = 1;
  filasPorPagina = 5;

  constructor(private productoFinancieroService: ProductoFinancieroService,
    private route: ActivatedRoute,
    private deteccionCambios: ChangeDetectorRef,
    private router: Router,
    private store: ProductoStore,
    private toast: OkError) {
  }

  ngOnInit() {
    this.obtenerProductos();
  }

  buscar(event: Event) {
    const valor = (event.target as HTMLInputElement).value.toLowerCase();
    if (valor.length < 1) {
      this.productosPaginados = this.listaProductos;
      return;
    }
    this.productosPaginados = this.listaProductos.filter(producto =>
      producto.name.toLowerCase().includes(valor)
    );
  }

  obtenerProductos() {
    this.productoFinancieroService.obtenerProductosFinancieros().subscribe({
      next: (data) => {
        this.listaProductos = data;
        this.actualizarPaginacion();
        this.deteccionCambios.detectChanges();
      },
      error: (err) => console.error('Error al obtener lista productos:', err)
    });
  }

  actualizarPaginacion() {
    const inicio = (this.paginaActual - 1) * this.filasPorPagina;
    const fin = inicio + this.filasPorPagina;
    this.productosPaginados = this.listaProductos.slice(inicio, fin);
  }

  cambiarFilas(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.filasPorPagina = Number(value);
    this.paginaActual = 1;
    this.actualizarPaginacion();
  }

  totalPaginas(): number {
    return Math.ceil(this.listaProductos.length / this.filasPorPagina);
  }

  irAPagina(pagina: number) {
    this.paginaActual = pagina;
    this.actualizarPaginacion();
  }

  irEditar(producto: ProductoFinanciero) {
    this.store.setProducto(producto);
    this.router.navigate(['/EditarProducto']);
  }

  abrirMenu(producto: ProductoFinanciero, event: MouseEvent) {
    this.store.setProducto(producto)
    this.productoAEliminar = producto;
    event.stopPropagation();
    this.posX = event.clientX;
    this.posY = event.clientY;
    this.mostrarMenu = true;
  }

  cerrarMenu() {
    this.mostrarMenu = false;
    this.productoSeleccionado = null;
  }

  editar() {
    this.router.navigate(['/EditarProducto'])
    this.cerrarMenu()
  }

  abrirModalEliminar() {
    this.mostrarModal = true;
    this.cerrarMenu();
  }

  cerrarModal() {
    this.mostrarModal = false
  }

  eliminarProducto() {
    this.mostrarModal = false
    this.productoFinancieroService.eliminarProducto(this.productoAEliminar.id).subscribe({
      next: (data) => {
        this.toast.show('Producto eliminado correctamente ' + data.message)
        this.obtenerProductos();
      },
      error: (err) => {
        this.toast.show('Error al eliminar producto', err)
      }
    })

  }

}
