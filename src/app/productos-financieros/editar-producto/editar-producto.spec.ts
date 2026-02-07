import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarProducto } from './editar-producto';
import { ProductoFinancieroService } from '../../servicios/producto-financiero-service';
import { ProductoStore } from '../../store/producto-store';
import { OkError } from '../../toast/ok-error';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { Component } from '@angular/core';
import { ConfirmacionError } from '../../mensaje/confirmacion-error/confirmacion-error';
import { ProductoFinanciero } from '../../Modelos/ProductoFinanciero';

@Component({
  selector: 'app-confirmacion-error',
  standalone: true,
  template: ''
})
class ConfirmacionErrorStub {}

class ProductoFinancieroServiceMock {
  editarProducto = vi.fn();
}

class ProductoStoreMock {
  getProducto = vi.fn();
}

class OkErrorMock {
  show = vi.fn();
}

describe('EditarProducto', () => {
  let component: EditarProducto;
  let fixture: ComponentFixture<EditarProducto>;
  let service: ProductoFinancieroServiceMock;
  let store: ProductoStoreMock;
  let toast: OkErrorMock;

  const productoMock = new ProductoFinanciero(
    '123',
    'Producto Test',
    'Descripción larga válida',
    'logo.png',
    new Date('2026-02-01'),
    new Date('2027-02-01')
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarProducto],
      providers: [
        { provide: ProductoFinancieroService, useClass: ProductoFinancieroServiceMock },
        { provide: ProductoStore, useClass: ProductoStoreMock },
        { provide: OkError, useClass: OkErrorMock }
      ]
    })
      .overrideComponent(EditarProducto, {
        remove: { imports: [ConfirmacionError] },
        add: { imports: [ConfirmacionErrorStub] }
      })
      .compileComponents();

    service = TestBed.inject(ProductoFinancieroService) as any;
    store = TestBed.inject(ProductoStore) as any;
    toast = TestBed.inject(OkError) as any;

    store.getProducto.mockReturnValue(productoMock);

    fixture = TestBed.createComponent(EditarProducto);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  // --- CREACIÓN ---
  it('debe crear el componente y el formulario', () => {
    expect(component).toBeTruthy();
    expect(component.form).toBeTruthy();
  });

  // --- ID DESHABILITADO ---
  it('el campo id debe estar deshabilitado', () => {
    const id = component.form.get('id');
    expect(id?.disabled).toBe(true);
  });

  // --- PATCH DESDE STORE ---
  it('debe cargar los datos del producto desde el store al iniciar', () => {
    const formValue = component.form.getRawValue();

    expect(formValue.id).toBe('123');
    expect(formValue.name).toBe('Producto Test');
    expect(formValue.description).toBe('Descripción larga válida');
    expect(formValue.logo).toBe('logo.png');
    expect(formValue.date_release).toBe('2026-02-01');
    expect(formValue.date_revision).toBe('2027-02-01');
  });

  // --- VALIDADORES ---
  it('name es requerido', () => {
    const name = component.form.get('name');
    name?.setValue('');
    expect(name?.hasError('required')).toBe(true);
  });

  it('description requiere mínimo 10 caracteres', () => {
    const desc = component.form.get('description');
    desc?.setValue('corto');
    expect(desc?.hasError('minlength')).toBe(true);
  });

  // --- VALIDADOR DE UN AÑO ---
  it('date_revision debe ser un año exacto después de date_release', () => {
    component.form.get('date_release')?.setValue('2026-02-01');
    component.form.get('date_revision')?.setValue('2026-02-10');

    expect(component.form.hasError('revisionIncorrecta')).toBe(true);
  });

  // --- EDITAR PRODUCTO ---
  it('editarProducto llama al servicio y muestra toast OK', async () => {
    service.editarProducto.mockReturnValue(of({ message: 'ok' }));

    component.editarProducto();

    await fixture.whenStable();

    expect(service.editarProducto).toHaveBeenCalledWith('123', component.form.getRawValue());
    expect(toast.show).toHaveBeenCalled();
  });

});
