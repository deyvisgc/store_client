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


@NgModule({
  declarations: [SelectproductoComponent, SelectclientesComponent, ProvedorselectComponent, SearchComponent, 
                 FormproductoComponent, FieldErrorDisplayComponentComponent
                ],
  exports: [
    SelectproductoComponent, SearchComponent , FormproductoComponent, ProvedorselectComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ComponenteshijosRoutingModule,
    AutocompleteLibModule
  ]
})
export class ComponenteshijosModule { }
