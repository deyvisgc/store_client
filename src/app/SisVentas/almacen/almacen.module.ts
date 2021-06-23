import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlmacenRoutingModule } from './almacen-routing.module';
import { ProductoComponent } from './producto/producto.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArchwizardModule } from 'angular-archwizard';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CustomFormsModule } from 'ng2-validation';
import { NgxPrintModule } from 'ngx-print';
import { NgxIziToastModule } from 'ngx-izitoast';
import { ClaseComponent } from './clase/clase.component';
import { LoteComponent } from './lote/lote.component';
import { UnidadmedidaComponent } from './unidadmedida/unidadmedida.component';
import { FormproductoComponent } from '../componenteshijos/formproducto/formproducto.component';
import { SharedModule } from '../shared-modulos/shared/shared.module';
import { FiltrosComponent } from '../componenteshijos/filtros/filtros.component';
import { ActualizarStockComponent } from './actualizar-stock/actualizar-stock.component';
import { ListLoteComponent } from './list-lote/list-lote.component';
@NgModule({
  declarations: [ProductoComponent, ClaseComponent, LoteComponent, UnidadmedidaComponent, FiltrosComponent, 
                 FormproductoComponent, ActualizarStockComponent, ListLoteComponent
                ],
  imports: [
    CommonModule,
    AlmacenRoutingModule,
    NgxDatatableModule,
    FormsModule,
    ArchwizardModule,
    ReactiveFormsModule,
    CKEditorModule,
    CustomFormsModule,
    NgxPrintModule,
    NgxIziToastModule,
    SharedModule
  ]
})
export class AlmacenModule { }
