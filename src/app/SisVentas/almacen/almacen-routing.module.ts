import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductoComponent } from './producto/producto.component';


const routes: Routes = [
  {
    path: 'Producto',
    component: ProductoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlmacenRoutingModule { }
