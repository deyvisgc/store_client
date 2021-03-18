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
import { FieldErrorDisplayComponentComponent } from './messageerror/field-error-display-component/field-error-display-component.component';
import { LoteComponent } from './lote/lote.component';
import { UnidadmedidaComponent } from './unidadmedida/unidadmedida.component';
import { ReloadComponent } from './reload/reload.component';
import { SearchComponent } from '../componenteshijos/search/search.component';
import { FormproductoComponent } from '../componenteshijos/formproducto/formproducto.component';

@NgModule({
  declarations: [ProductoComponent, ClaseComponent, FieldErrorDisplayComponentComponent, LoteComponent,
                 UnidadmedidaComponent, ReloadComponent, SearchComponent, FormproductoComponent
                ],
  exports: [FieldErrorDisplayComponentComponent],
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
    NgxIziToastModule
  ]
})
export class AlmacenModule { }
