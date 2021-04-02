import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { InventarioComponent } from './reportes/inventario/inventario.component';
import { ReportesComponent } from './reportes/reportes.component';
import { SangriaComponent } from './reportes/sangria/sangria.component';


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
   },
   {
    path: 'Reportes/Sangria',
    component : SangriaComponent
   }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprasRoutingModule { }
