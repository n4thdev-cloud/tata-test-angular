import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agregar',
  imports: [],
  templateUrl: './agregar.html',
  styleUrl: './agregar.css',
})
export class Agregar {
  constructor(private router: Router) { }
  irAgregar() {
    this.router.navigate(['/AgregarProducto']);
  }

}
