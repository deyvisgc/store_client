import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponenteshijosRoutingModule } from './componenteshijos-routing.module';
import { SelectproductoComponent } from './selectproducto/selectproducto.component';
import { SelectclientesComponent } from './selectclientes/selectclientes.component';
import { ProvedorselectComponent } from './provedorselect/provedorselect.component';
import { FormproductoComponent } from './formproducto/formproducto.component';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
// tslint:disable-next-line:max-line-length
import { FieldErrorDisplayComponentComponent } from '../almacen/messageerror/field-error-display-component/field-error-display-component.component';
import { BrowserModule } from '@angular/platform-browser';
import { ComprasAnuladasComponent } from './compras-anuladas/compras-anuladas.component';
import { ComprasVigentesComponent } from './compras-vigentes/compras-vigentes.component';
import { ComprasContadoComponent } from './compras-contado/compras-contado.component';
import { ComprasCreditoComponent } from './compras-credito/compras-credito.component';
import { FiltrosComponent } from './filtros/filtros.component';
import { CSeleccionarCategoriaComponent } from './c-seleccionar-categoria/c-seleccionar-categoria.component';
import { CSeleccionarLoteComponent } from './c-seleccionar-lote/c-seleccionar-lote.component';
import { CSeleccionarUnidadMedidaComponent } from './c-seleccionar-unidad-medida/c-seleccionar-unidad-medida.component';
import { SharedModule } from '../shared-modulos/shared/shared.module';
@NgModule({
  declarations: [SelectproductoComponent, SelectclientesComponent, ProvedorselectComponent, FiltrosComponent,
                 FormproductoComponent, FieldErrorDisplayComponentComponent,
                 ComprasAnuladasComponent, ComprasVigentesComponent, ComprasContadoComponent,
                  ComprasCreditoComponent, CSeleccionarCategoriaComponent, CSeleccionarLoteComponent, CSeleccionarUnidadMedidaComponent
                ],
  exports: [
    SelectproductoComponent, FiltrosComponent , FormproductoComponent, ProvedorselectComponent,
      ComprasAnuladasComponent, ComprasVigentesComponent, ComprasContadoComponent,
      ComprasCreditoComponent, CSeleccionarCategoriaComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ComponenteshijosRoutingModule,
    AutocompleteLibModule,
    SharedModule
  ]
})
export class ComponenteshijosModule { }
