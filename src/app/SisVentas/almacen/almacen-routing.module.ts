import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActualizarStockComponent } from './actualizar-stock/actualizar-stock.component';
import { ClaseComponent } from './clase/clase.component';
import { LoteComponent } from './lote/lote.component';
import { ProductoComponent } from './producto/producto.component';
import { UnidadmedidaComponent } from './unidadmedida/unidadmedida.component';


const routes: Routes = [
  {
    path: 'productos',
    component: ProductoComponent
  },
  {
    path: 'categoria',
    component: ClaseComponent
  },
  {
    path: 'lote',
    component: LoteComponent
  },
  {
    path: 'unidad-medida',
    component: UnidadmedidaComponent
  },
  {
    path: 'ajustar-stock',
    component: ActualizarStockComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlmacenRoutingModule { }
