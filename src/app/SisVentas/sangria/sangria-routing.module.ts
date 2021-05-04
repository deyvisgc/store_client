import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SangriaComponent } from './sangria.component';


const routes: Routes = [
  {
    path: '',
    component : SangriaComponent
   },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SangriaRoutingModule { }
