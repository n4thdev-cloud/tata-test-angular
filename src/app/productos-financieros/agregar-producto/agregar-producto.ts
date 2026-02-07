import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import { fechaMayorIgualHoy, fechaRevisionUnAnio, idNoExiste } from './validar-producto';
import { ProductoFinancieroService } from '../../servicios/producto-financiero-service';
import { ProductoMapper } from '../../mapper/ProductoMapper';
import { OkError } from '../../toast/ok-error';
import { ConfirmacionError } from '../../mensaje/confirmacion-error/confirmacion-error';

type ProductoForm = {
  id: FormControl<string>;
  name: FormControl<string>;
  description: FormControl<string>;
  logo: FormControl<string>;
  date_release: FormControl<string>;
  date_revision: FormControl<string>;
};

@Component({
  selector: 'app-agregar-producto',
  imports: [ReactiveFormsModule, ConfirmacionError],
  templateUrl: './agregar-producto.html',
  styleUrl: './agregar-producto.css',
})
export class AgregarProducto {

  form!: FormGroup<ProductoForm>;

  constructor(private fb: NonNullableFormBuilder,
    private productoFinancieroService: ProductoFinancieroService,
    private toast: OkError) { 
    }

  ngOnInit() {
    this.form = this.fb.group({
      id: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
        asyncValidators: [idNoExiste(this.productoFinancieroService)],
        updateOn: 'blur'
      }),
      name: this.fb.control('', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
      description: this.fb.control('', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]),
      logo: this.fb.control('', Validators.required),
      date_release: this.fb.control('', [Validators.required, fechaMayorIgualHoy]),
      date_revision: this.fb.control('', Validators.required),
    }, {
      validators: [fechaRevisionUnAnio]
    });
    this.form.statusChanges.subscribe(s => console.log(s));

  }

  agregarProducto() {
    console.log(ProductoMapper.transformarAProducto(this.form.getRawValue()))
    this.productoFinancieroService.agregarProducto(this.form.getRawValue()).subscribe({
      next: (data) => {
        this.toast.show('Producto eliminado correctamente ' + data.message)
      },
      error: (err) => {
        this.toast.show('Error al eliminar producto', err)
      }
    });
  }

}

