import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { ReportesComponent } from './reportes/reportes.component';


const routes: Routes = [
  {
    path: 'Index',
    component : IndexComponent
   },
   {
    path: 'Reportes/:typelista',
    component : ReportesComponent
   }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprasRoutingModule { }
