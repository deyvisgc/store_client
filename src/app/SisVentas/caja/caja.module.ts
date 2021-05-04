import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CajaRoutingModule } from './caja-routing.module';
import { HistorialcajaComponent } from './historialcaja/historialcaja.component';
import { AdministracajaComponent } from './administracaja/administracaja.component';
import { FormsModule } from '@angular/forms';
import { CortesxdiaComponent } from './cortesxdia/cortesxdia.component';
import { CortesxsemanaComponent } from './cortesxsemana/cortesxsemana.component';
import { LunesComponent } from './cortesxsemana/lunes/lunes.component';
import { MartesComponent } from './cortesxsemana/martes/martes.component';
import { MiercolesComponent } from './cortesxsemana/miercoles/miercoles.component';
import { ViernesComponent } from './cortesxsemana/viernes/viernes.component';
import { JuevesComponent } from './cortesxsemana/jueves/jueves.component';
import { ArqueocajaComponent } from './arqueocaja/arqueocaja.component';
import { SharedModule } from '../shared-modulos/shared/shared.module';


@NgModule({
  declarations: [HistorialcajaComponent, AdministracajaComponent, CortesxdiaComponent,
                  CortesxsemanaComponent, LunesComponent, MartesComponent, JuevesComponent,
                   MiercolesComponent, ViernesComponent, ArqueocajaComponent ],
  imports: [
    CommonModule,
    CajaRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class CajaModule { }
