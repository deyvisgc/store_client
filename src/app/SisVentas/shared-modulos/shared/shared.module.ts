import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { ReloadComponent } from '../../reload/reload/reload.component';
import { ReloadformComponent } from '../../reload/reloadform/reloadform.component';
import { ReloadFiltrosComponent } from '../../reload/reload-filtros/reload-filtros.component';
import { CargandoModalComponent } from '../../reload/cargando-modal/cargando-modal.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FormsModule } from '@angular/forms';
import { CSeleccionarCategoriaComponent } from '../../componenteshijos/c-seleccionar-categoria/c-seleccionar-categoria.component';
import { CSeleccionarLoteComponent } from '../../componenteshijos/c-seleccionar-lote/c-seleccionar-lote.component';
// tslint:disable-next-line:max-line-length
import { CSeleccionarUnidadMedidaComponent } from '../../componenteshijos/c-seleccionar-unidad-medida/c-seleccionar-unidad-medida.component';
// tslint:disable-next-line:max-line-length
import { CSeleccionarSubCategoriaComponent } from '../../componenteshijos/c-seleccionar-sub-categoria/c-seleccionar-sub-categoria.component';
// tslint:disable-next-line:max-line-length
import { FieldErrorDisplayComponentComponent } from '../../componenteshijos/field-error-display-component/field-error-display-component.component';



@NgModule({
  declarations: [CargandoModalComponent, ReloadFiltrosComponent, ReloadComponent, ReloadformComponent,
                 CSeleccionarCategoriaComponent, CSeleccionarLoteComponent,
                 CSeleccionarUnidadMedidaComponent, CSeleccionarSubCategoriaComponent,
                 FieldErrorDisplayComponentComponent],
  exports: [ReloadComponent, ReloadformComponent, ReloadFiltrosComponent, CargandoModalComponent, InfiniteScrollModule,
            CSeleccionarCategoriaComponent, CSeleccionarLoteComponent, CSeleccionarUnidadMedidaComponent,
            CSeleccionarSubCategoriaComponent, FieldErrorDisplayComponentComponent],
  imports: [
    CommonModule,
    SharedRoutingModule,
    InfiniteScrollModule,
    FormsModule
  ]
})
export class SharedModule { }
