import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CajaRoutingModule } from './caja-routing.module';
import { HistorialcajaComponent } from './historialcaja/historialcaja.component';
import { AdministracajaComponent } from './administracaja/administracaja.component';
import { FormsModule } from '@angular/forms';
import { CargardoComponentComponent } from '../componenteshijos/cargardo-component/cargardo-component.component';
import { ReloadFiltrosComponent } from '../componenteshijos/reload-filtros/reload-filtros.component';
import { CortesxdiaComponent } from './cortesxdia/cortesxdia.component';
import { CortesxsemanaComponent } from './administracaja/cortesxsemana/cortesxsemana.component';
import { LunesComponent } from './administracaja/cortesxsemana/lunes/lunes.component';
import { MartesComponent } from './administracaja/cortesxsemana/martes/martes.component';
import { JuevesComponent } from './administracaja/cortesxsemana/jueves/jueves.component';
import { MiercolesComponent } from './administracaja/cortesxsemana/miercoles/miercoles.component';
import { ViernesComponent } from './administracaja/cortesxsemana/viernes/viernes.component';
import { SabadoComponent } from './administracaja/cortesxsemana/sabado/sabado.component';
import { DomingoComponent } from './administracaja/cortesxsemana/domingo/domingo.component';


@NgModule({
  declarations: [HistorialcajaComponent, AdministracajaComponent, CargardoComponentComponent, ReloadFiltrosComponent, CortesxdiaComponent, CortesxsemanaComponent, LunesComponent, MartesComponent, JuevesComponent, MiercolesComponent, ViernesComponent, SabadoComponent, DomingoComponent],
  imports: [
    CommonModule,
    CajaRoutingModule,
    FormsModule
  ]
})
export class CajaModule { }
