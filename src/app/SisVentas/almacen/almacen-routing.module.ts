import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClaseComponent } from './clase/clase.component';
import { ProductoComponent } from './producto/producto.component';


const routes: Routes = [
  {
    path: 'Producto',
    component: ProductoComponent
  },
  {
    path: 'Clase',
    component: ClaseComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlmacenRoutingModule { }
