import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponenteshijosRoutingModule } from './componenteshijos-routing.module';
import { SelectproductoComponent } from './selectproducto/selectproducto.component';
import { SelectclientesComponent } from './selectclientes/selectclientes.component';
import { ProvedorselectComponent } from './provedorselect/provedorselect.component';
import { FormproductoComponent } from './formproducto/formproducto.component';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
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
import { CSeleccionarSubCategoriaComponent } from './c-seleccionar-sub-categoria/c-seleccionar-sub-categoria.component';
import { CSeleccionarProductosComponent } from './c-seleccionar-productos/c-seleccionar-productos.component';
@NgModule({
  declarations: [SelectproductoComponent, SelectclientesComponent, ProvedorselectComponent, FiltrosComponent,
                 FormproductoComponent, ComprasAnuladasComponent, ComprasVigentesComponent, ComprasContadoComponent,
                  ComprasCreditoComponent, CSeleccionarCategoriaComponent, CSeleccionarLoteComponent, CSeleccionarUnidadMedidaComponent, 
                  CSeleccionarSubCategoriaComponent, CSeleccionarProductosComponent
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
