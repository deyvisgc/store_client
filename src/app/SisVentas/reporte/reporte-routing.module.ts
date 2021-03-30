import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {VentaComponent} from './venta/venta.component';


const routes: Routes = [
  {
    path: 'Ventas',
    component: VentaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReporteRoutingModule { }
