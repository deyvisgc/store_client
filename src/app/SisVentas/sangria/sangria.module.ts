import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SangriaRoutingModule } from './sangria-routing.module';
import { EgresosComponent } from './egresos/egresos.component';
import { IngresosComponent } from './ingresos/ingresos.component';
import { SangriaComponent } from './sangria.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared-modulos/shared/shared.module';


@NgModule({
  declarations: [SangriaComponent, EgresosComponent, IngresosComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    SangriaRoutingModule
  ]
})
export class SangriaModule { }
