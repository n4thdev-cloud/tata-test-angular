import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AsyncValidatorFn } from '@angular/forms';
import { map, catchError, of } from 'rxjs';
import { ProductoFinancieroService } from '../../servicios/producto-financiero-service';

export const fechaMayorIgualHoy: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.value) return null;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const [year, month, day] = control.value.split('-').map(Number);
  const fecha = new Date(year, month - 1, day);

  return fecha >= hoy ? null : { fechaPasada: true };
};

export const fechaRevisionUnAnio: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const fechaLiberacion = group.get('date_release')?.value;
  const fechaRevision = group.get('date_revision')?.value;

  if (!fechaLiberacion || !fechaRevision) return null;

  const liberacion = new Date(fechaLiberacion);
  const revision = new Date(fechaRevision);

  liberacion.setFullYear(liberacion.getFullYear() + 1);

  return liberacion.getTime() === revision.getTime() ? null : { revisionIncorrecta: true };
};

export function idNoExiste(service: ProductoFinancieroService): AsyncValidatorFn {
  return (control: AbstractControl) => {
    return service.verificarId(control.value).pipe(
      map(existe => existe ? null : { idExiste: true })
    );
  };
};
