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

@NgModule({
  declarations: [IndexComponent, SelectproductoComponent, ProvedorselectComponent],
  imports: [
    CommonModule,
    AutocompleteLibModule,
    ComprasRoutingModule,
    NgxPaginationModule,
    FormsModule
  ]
})
export class ComprasModule { }
