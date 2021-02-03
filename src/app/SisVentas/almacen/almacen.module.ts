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

@NgModule({
  declarations: [ProductoComponent],
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
