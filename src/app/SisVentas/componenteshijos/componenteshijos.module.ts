import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponenteshijosRoutingModule } from './componenteshijos-routing.module';
import { SelectproductoComponent } from './selectproducto/selectproducto.component';
import { SelectclientesComponent } from './selectclientes/selectclientes.component';
import { ProvedorselectComponent } from './provedorselect/provedorselect.component';
import { SearchComponent } from './search/search.component';
import { FormproductoComponent } from './formproducto/formproducto.component';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
// tslint:disable-next-line:max-line-length
import { FieldErrorDisplayComponentComponent } from '../almacen/messageerror/field-error-display-component/field-error-display-component.component';
import { BrowserModule } from '@angular/platform-browser';
import { ListCreditoComponent } from './list-credito/list-credito.component';
import { ListProductosMasCompradosComponent } from './list-productos-mas-comprados/list-productos-mas-comprados.component';


@NgModule({
  declarations: [SelectproductoComponent, SelectclientesComponent, ProvedorselectComponent, SearchComponent,
                 FormproductoComponent, FieldErrorDisplayComponentComponent, ListCreditoComponent, ListProductosMasCompradosComponent
                ],
  exports: [
    SelectproductoComponent, SearchComponent , FormproductoComponent, ProvedorselectComponent, ListCreditoComponent, 
    ListProductosMasCompradosComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ComponenteshijosRoutingModule,
    AutocompleteLibModule
  ]
})
export class ComponenteshijosModule { }
