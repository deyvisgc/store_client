import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministracajaComponent } from './administracaja/administracaja.component';
import { ArqueocajaComponent } from './arqueocaja/arqueocaja.component';
import { CortesxdiaComponent } from './cortesxdia/cortesxdia.component';
import { CortesxsemanaComponent } from './cortesxsemana/cortesxsemana.component';
import { HistorialcajaComponent } from './historialcaja/historialcaja.component';


const routes: Routes = [
  {
    path: 'administracion',
    component : AdministracajaComponent
  },
  {
    path: 'historial',
    component : HistorialcajaComponent
  },
  {
    path: 'Administrar/CortesDiario/:idCaja',
    component : CortesxdiaComponent
  },
  {
    path: 'Administrar/CortesSemanales/:idCaja',
    component : CortesxsemanaComponent
  },
  {
    path: 'Administrar/Arqueo/:idCaja',
    component : ArqueocajaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CajaRoutingModule { }
