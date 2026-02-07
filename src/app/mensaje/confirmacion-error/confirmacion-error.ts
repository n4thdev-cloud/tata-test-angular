import { Component, inject } from '@angular/core';
import { OkError } from '../../toast/ok-error';

@Component({
  selector: 'app-confirmacion-error',
    standalone: true,
  imports: [],
  templateUrl: './confirmacion-error.html',
  styleUrl: './confirmacion-error.css',
})
export class ConfirmacionError {
toastService = inject(OkError);
}
