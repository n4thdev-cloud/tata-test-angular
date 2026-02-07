import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmacion-modal',
  imports: [],
  templateUrl: './confirmacion-modal.html',
  styleUrl: './confirmacion-modal.css',
})
export class ConfirmacionModal {
  @Input() titulo = 'Confirmar acción';
  @Input() mensaje = '¿Estás seguro?';

  @Output() confirmar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();
}
