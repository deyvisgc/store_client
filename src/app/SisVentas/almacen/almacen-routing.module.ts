import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClaseComponent } from './clase/clase.component';
import { LoteComponent } from './lote/lote.component';
import { ProductoComponent } from './producto/producto.component';
import { UnidadmedidaComponent } from './unidadmedida/unidadmedida.component';


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
    path: 'Lote',
    component: LoteComponent
  },
  {
    path: 'Unidad/Medida',
    component: UnidadmedidaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlmacenRoutingModule { }
