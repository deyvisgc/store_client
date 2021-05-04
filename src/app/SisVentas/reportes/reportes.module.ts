import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportesRoutingModule } from './reportes-routing.module';
import { SharedModule } from '../shared-modulos/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ReporComprasComponent } from './repor-compras/repor-compras.component';
import { ComprasAnuladasComponent } from '../componenteshijos/compras-anuladas/compras-anuladas.component';
import { ComprasVigentesComponent } from '../componenteshijos/compras-vigentes/compras-vigentes.component';
import { ComprasContadoComponent } from '../componenteshijos/compras-contado/compras-contado.component';
import { ComprasCreditoComponent } from '../componenteshijos/compras-credito/compras-credito.component';
import { InventarioComponent } from './inventario/inventario.component';

@NgModule({
  declarations: [ReporComprasComponent, ComprasAnuladasComponent, ComprasVigentesComponent, ComprasContadoComponent,
                 ComprasCreditoComponent, InventarioComponent],
  imports: [
    CommonModule,
    ReportesRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class ReportesModule { }
