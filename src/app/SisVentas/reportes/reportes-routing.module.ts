import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventarioComponent } from './inventario/inventario.component';
import { ReporComprasComponent } from './repor-compras/repor-compras.component';


const routes: Routes = [
  {
    path: 'compras',
    component : ReporComprasComponent
   },
   {
    path: 'inventario',
    component : InventarioComponent
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
