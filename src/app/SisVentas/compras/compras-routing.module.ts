import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { InventarioComponent } from './reportes/inventario/inventario.component';
import { ReportesComponent } from './reportes/reportes.component';


const routes: Routes = [
  {
    path: 'Index',
    component : IndexComponent
   },
   {
    path: 'Reportes/Compras',
    component : ReportesComponent
   },
   {
    path: 'Reportes/Inventario',
    component : InventarioComponent
   }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprasRoutingModule { }
