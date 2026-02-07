import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeProductosFinancieros } from './home-productos-financieros';
import { ActivatedRoute } from '@angular/router';

describe('HomeProductosFinancieros', () => {
  let component: HomeProductosFinancieros;
  let fixture: ComponentFixture<HomeProductosFinancieros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeProductosFinancieros],
      providers: [
        { provide: ActivatedRoute, useValue: {} } // ✅ CLAVE
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HomeProductosFinancieros);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
