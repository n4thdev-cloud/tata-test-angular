import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarProducto } from './agregar-producto';
import { ProductoFinancieroService } from '../../servicios/producto-financiero-service';
import { OkError } from '../../toast/ok-error';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ConfirmacionError } from '../../mensaje/confirmacion-error/confirmacion-error';
import { Component } from '@angular/core';

@Component({
  selector: 'app-confirmacion-error',
  standalone: true,
  template: ''
})
class ConfirmacionErrorStub { }

class ProductoFinancieroServiceMock {
  verificarId = vi.fn();
  agregarProducto = vi.fn();
}

class OkErrorMock {
  show = vi.fn();
}

describe('AgregarProducto', () => {
  let component: AgregarProducto;
  let fixture: ComponentFixture<AgregarProducto>;
  let service: ProductoFinancieroServiceMock;
  let toast: OkErrorMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarProducto],
      providers: [
        { provide: ProductoFinancieroService, useClass: ProductoFinancieroServiceMock },
        { provide: OkError, useClass: OkErrorMock }
      ]
    })
      .overrideComponent(AgregarProducto, {
        remove: { imports: [ConfirmacionError] },
        add: { imports: [ConfirmacionErrorStub] }
      })
      .compileComponents();

    service = TestBed.inject(ProductoFinancieroService) as any;

    // 🔥 MUY IMPORTANTE: definir comportamiento ANTES
    service.verificarId.mockReturnValue(of(true));

    fixture = TestBed.createComponent(AgregarProducto);
    component = fixture.componentInstance;
    toast = TestBed.inject(OkError) as any;

    fixture.detectChanges();
  });


  // --- CREACIÓN DEL FORM ---
  it('debe crear el formulario en ngOnInit', () => {
    expect(component.form).toBeTruthy();
  });

  // --- VALIDADORES BÁSICOS ---
  it('id es requerido', () => {
    const id = component.form.get('id');
    id?.setValue('');
    expect(id?.hasError('required')).toBe(true);
  });

  it('name requiere mínimo 5 caracteres', () => {
    const name = component.form.get('name');
    name?.setValue('abc');
    expect(name?.hasError('minlength')).toBe(true);
  });

  it('description requiere mínimo 10 caracteres', () => {
    const desc = component.form.get('description');
    desc?.setValue('corto');
    expect(desc?.hasError('minlength')).toBe(true);
  });

  // --- VALIDACIÓN DE FECHA MAYOR O IGUAL A HOY ---
  it('date_release no puede ser menor a hoy', () => {
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);
    const fecha = ayer.toISOString().split('T')[0];

    const control = component.form.get('date_release');
    control?.setValue(fecha);

    expect(control?.hasError('fechaPasada')).toBe(true);
  });

  // --- VALIDADOR DE UN AÑO EXACTO ---
  it('date_revision debe ser un año exacto después de date_release', () => {
    component.form.get('date_release')?.setValue('2026-02-01');
    component.form.get('date_revision')?.setValue('2026-02-10');

    expect(component.form.hasError('revisionIncorrecta')).toBe(true);
  });

  it('date_revision válido cuando es un año exacto', () => {
    component.form.get('date_release')?.setValue('2026-02-01');
    component.form.get('date_revision')?.setValue('2027-02-01');

    expect(component.form.hasError('revisionIncorrecta')).toBe(false);
  });

  // --- VALIDADOR ASÍNCRONO ID ---
  it('marca error si el id NO existe (async validator)', async () => {
    service.verificarId.mockReturnValue(of(false));

    const id = component.form.get('id')!;
    id.setValue('123');

    // Simular BLUR (clave)
    id.markAsTouched();
    id.updateValueAndValidity({ onlySelf: true, emitEvent: true });

    await fixture.whenStable();

    expect(id.hasError('idExiste')).toBe(true);
  });


  it('no marca error si el id existe', async () => {
    service.verificarId.mockReturnValue(of(true));

    const id = component.form.get('id')!;
    id.setValue('123');

    id.markAsTouched();
    id.updateValueAndValidity({ onlySelf: true, emitEvent: true });

    await fixture.whenStable();

    expect(id.hasError('idExiste')).toBe(false);
  });


  // --- ENVIAR FORMULARIO ---
it('agregarProducto llama al servicio y muestra toast OK', async () => {
  service.agregarProducto.mockReturnValue(of({ message: 'ok' }));

  component.form.setValue({
    id: '123',
    name: 'Producto válido',
    description: 'Descripción válida larga',
    logo: 'logo.png',
    date_release: '2026-02-01',
    date_revision: '2027-02-01'
  });

  component.agregarProducto();

  await fixture.whenStable();

  expect(service.agregarProducto).toHaveBeenCalled();
  expect(toast.show).toHaveBeenCalled();
});


});
