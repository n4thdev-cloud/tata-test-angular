import { Routes } from '@angular/router';
import { HomeProductosFinancieros } from './productos-financieros/home-productos-financieros/home-productos-financieros';
import { AgregarProducto } from './productos-financieros/agregar-producto/agregar-producto';
import { EditarProducto } from './productos-financieros/editar-producto/editar-producto';

export const routes: Routes = [
    {
        path: '',
        title: 'Productos Financieros',
        component: HomeProductosFinancieros
    },
    {
        path: 'AgregarProducto',
        title: 'Agregar Producto',
        component: AgregarProducto
    },
        {
        path: 'EditarProducto',
        title: 'Editar Producto',
        component: EditarProducto
    },


    
];
