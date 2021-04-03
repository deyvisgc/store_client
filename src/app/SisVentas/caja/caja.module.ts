import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CajaRoutingModule } from './caja-routing.module';
import { HistorialcajaComponent } from './historialcaja/historialcaja.component';
import { AdministracajaComponent } from './administracaja/administracaja.component';


@NgModule({
  declarations: [HistorialcajaComponent, AdministracajaComponent],
  imports: [
    CommonModule,
    CajaRoutingModule
  ]
})
export class CajaModule { }
