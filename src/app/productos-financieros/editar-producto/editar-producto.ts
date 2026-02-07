import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import { fechaMayorIgualHoy, fechaRevisionUnAnio, idNoExiste } from '../agregar-producto/validar-producto';
import { ProductoFinancieroService } from '../../servicios/producto-financiero-service';
import { ProductoMapper } from '../../mapper/ProductoMapper';
import { ProductoFinanciero } from '../../Modelos/ProductoFinanciero';
import { formatearFechaCorta } from '../../util/util';
import { ProductoStore } from '../../store/producto-store';
import { ConfirmacionError } from '../../mensaje/confirmacion-error/confirmacion-error';
import { OkError } from '../../toast/ok-error';

type ProductoForm = {
  id: FormControl<string>;
  name: FormControl<string>;
  description: FormControl<string>;
  logo: FormControl<string>;
  date_release: FormControl<string>;
  date_revision: FormControl<string>;
};

@Component({
  selector: 'app-editar-producto',
  imports: [ReactiveFormsModule, ConfirmacionError],
  templateUrl: './editar-producto.html',
  styleUrl: './editar-producto.css',
})
export class EditarProducto {

  producto!: ProductoFinanciero;
  form!: FormGroup<ProductoForm>;

  constructor(private fb: NonNullableFormBuilder,
    private productoFinancieroService: ProductoFinancieroService,
    private store: ProductoStore,
    private toast: OkError) {

  }

  ngOnInit() {
    const productoGuardado = this.store.getProducto();

    this.form = this.fb.group({
      id: [{ value: '', disabled: true }],
      name: this.fb.control('', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
      description: this.fb.control('', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]),
      logo: this.fb.control('', Validators.required),
      date_release: this.fb.control('', [Validators.required, fechaMayorIgualHoy]),
      date_revision: this.fb.control('', Validators.required),
    }, {
      validators: [fechaRevisionUnAnio]
    });

    if (productoGuardado) {
      this.form.patchValue({
        ...productoGuardado,
        date_release: formatearFechaCorta(productoGuardado.fechaEntrega),
        date_revision: formatearFechaCorta(productoGuardado.fechaRevision)
      });
    }

    this.form.statusChanges.subscribe(s => console.log(s));

  }

  editarProducto() {
    const productoSeleccionado = this.form.getRawValue();
    this.productoFinancieroService.editarProducto(productoSeleccionado.id, productoSeleccionado).subscribe({
      next: (data) => {
        this.toast.show('Producto eliminado correctamente ' + data.message)
      },
      error: (err) => {
        this.toast.show('Error al eliminar producto', err)
      }
    });

  }

}
