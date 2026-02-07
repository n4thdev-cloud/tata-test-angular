import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Agregar } from './agregar';

import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';

class RouterMock {
  navigate = vi.fn();
}

describe('Agregar', () => {
  let component: Agregar;
  let fixture: ComponentFixture<Agregar>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Agregar],
      providers: [{ provide: Router, useClass: RouterMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(Agregar);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('debe navegar a /AgregarProducto al hacer click', () => {
    const boton = fixture.debugElement.query(By.css('button'));
    boton.nativeElement.click();

    expect(router.navigate).toHaveBeenCalledWith(['/AgregarProducto']);
  });
});