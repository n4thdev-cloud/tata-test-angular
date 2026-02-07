import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListadoProductos } from './listado-productos';
import { ProductoFinancieroService } from '../../servicios/producto-financiero-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoStore } from '../../store/producto-store';
import { OkError } from '../../toast/ok-error';
import { of } from 'rxjs';
import { ProductoFinanciero } from '../../Modelos/ProductoFinanciero';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
import { Component } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { ConfirmacionError } from '../../mensaje/confirmacion-error/confirmacion-error';


@Component({
  selector: 'app-agregar',
  standalone: true,
  template: `<button (click)="click.emit()">Agregar</button>`
})
class AgregarMock {
  @Output() click = new EventEmitter<void>();
}

@Component({
  selector: 'app-confirmacion-modal',
  standalone: true,
  template: ''
})
class ConfirmacionModalMock {
  @Output() confirmar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();
}

const ActivatedRouteMock = {
  snapshot: {
    paramMap: {
      get: () => null
    }
  },
  params: of({}),
  queryParams: of({})
};

@Component({
  selector: 'app-confirmacion-error',
  standalone: true,
  template: ''
})
class ConfirmacionErrorStub { }

// --- MOCK DE PRODUCTOS ---
const mockProductos: ProductoFinanciero[] = [
  new ProductoFinanciero('1', 'Producto 1', 'Descripción 1', 'logo1.png', new Date('2026-02-01'), new Date('2026-02-10')),
  new ProductoFinanciero('2', 'Producto 2', 'Descripción 2', 'logo2.png', new Date('2026-03-01'), new Date('2026-03-10')),
  new ProductoFinanciero('3', 'Producto 3', 'Descripción 3', 'logo3.png', new Date('2026-04-01'), new Date('2026-04-10'))
];

// --- MOCK DEL SERVICIO ---
class ProductoFinancieroServiceMock {
  obtenerProductosFinancieros() { return of(mockProductos); }
  eliminarProducto(id: string) { return of({ message: 'Producto eliminado correctamente' }); }
}

// --- MOCKS ADICIONALES ---
class RouterMock {
  navigate = vi.fn();
}

class ProductoStoreMock {
  setProducto = vi.fn();
}

class OkErrorMock {
  show = vi.fn();
}

describe('ListadoProductos completo', () => {
  let component: ListadoProductos;
  let fixture: ComponentFixture<ListadoProductos>;
  let toast: OkError;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ListadoProductos,
        AgregarMock,
        ConfirmacionModalMock,
        ConfirmacionError   // 👈 clave
      ],
      providers: [
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: ProductoStore, useValue: { setProducto: vi.fn() } },
        { provide: OkError, useValue: { show: vi.fn() } },
        { provide: ProductoFinancieroService, useClass: ProductoFinancieroServiceMock },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } }
      ]
    })
      .overrideComponent(ListadoProductos, {
        remove: { imports: [ConfirmacionError] },
        add: { imports: [ConfirmacionErrorStub] }
      })
      .compileComponents();

    fixture = TestBed.createComponent(ListadoProductos);
    component = fixture.componentInstance;
    toast = TestBed.inject(OkError);
    router = TestBed.inject(Router);

    fixture.detectChanges();
    await fixture.whenStable();
  });


  // --- CREACIÓN ---
  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit debe llamar a obtenerProductos', () => {
    vi.spyOn(component, 'obtenerProductos');
    component.ngOnInit();
    expect(component.obtenerProductos).toHaveBeenCalled();
  });

  // --- CARGA DE PRODUCTOS ---
  it('obtenerProductos debe cargar listaProductos y productosPaginados', () => {
    component.obtenerProductos();
    expect(component.listaProductos.length).toBe(3);
    expect(component.productosPaginados.length).toBe(3);
  });

  // --- BÚSQUEDA ---
  it('input de búsqueda filtra productos', () => {
    const input = fixture.debugElement.query(By.css('.buscar-input')).nativeElement;
    input.value = 'Producto 1';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.productosPaginados.length).toBe(1);
    expect(component.productosPaginados[0].name).toBe('Producto 1');
  });

  it('buscar con cadena vacía muestra todos los productos', () => {
    const input = fixture.debugElement.query(By.css('.buscar-input')).nativeElement;
    input.value = '';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.productosPaginados.length).toBe(3);
  });

  // --- TABLA ---
  it('tabla muestra productos correctos', () => {
    const filas = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(filas.length).toBe(3);
    expect(filas[0].nativeElement.textContent).toContain('Producto 1');
    expect(filas[1].nativeElement.textContent).toContain('Producto 2');
  });

});
