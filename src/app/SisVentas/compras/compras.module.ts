import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComprasRoutingModule } from './compras-routing.module';
import { IndexComponent } from './index/index.component';
import { SelectproductoComponent } from '../componenteshijos/selectproducto/selectproducto.component';
import { ProvedorselectComponent } from '../componenteshijos/provedorselect/provedorselect.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReportesComponent } from './reportes/reportes.component';
import { ListCreditoComponent } from '../componenteshijos/list-credito/list-credito.component';
// tslint:disable-next-line:max-line-length
import { ListProductosMasCompradosComponent } from '../componenteshijos/list-productos-mas-comprados/list-productos-mas-comprados.component';

@NgModule({
  declarations: [IndexComponent, SelectproductoComponent, ProvedorselectComponent, ReportesComponent, ListCreditoComponent, 
                 ListProductosMasCompradosComponent],
  imports: [
    CommonModule,
    AutocompleteLibModule,
    ComprasRoutingModule,
    NgxPaginationModule,
    FormsModule
  ]
})
export class ComprasModule { }