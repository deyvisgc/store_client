import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClaseComponent } from './clase/clase.component';
import { ProductoComponent } from './producto/producto.component';
import { PruebaComponent } from './prueba/prueba.component';


const routes: Routes = [
  {
    path: 'Producto',
    component: ProductoComponent
  },
  {
    path: 'Clase',
    component: ClaseComponent
  },
  {
    path: 'Deyvis',
    component: PruebaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlmacenRoutingModule { }
