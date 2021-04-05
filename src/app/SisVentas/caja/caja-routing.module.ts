import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministracajaComponent } from './administracaja/administracaja.component';
import { CortesxdiaComponent } from './cortesxdia/cortesxdia.component';
import { HistorialcajaComponent } from './historialcaja/historialcaja.component';


const routes: Routes = [
  {
    path: 'Administrar',
    component : AdministracajaComponent
  },
  {
    path: 'Historial',
    component : HistorialcajaComponent
  },
  {
    path: 'Administrar/CortesDiario/:idCaja',
    component : CortesxdiaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CajaRoutingModule { }
