import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { ReloadComponent } from '../../reload/reload/reload.component';
import { ReloadformComponent } from '../../reload/reloadform/reloadform.component';
import { ReloadFiltrosComponent } from '../../reload/reload-filtros/reload-filtros.component';
import { CargandoModalComponent } from '../../reload/cargando-modal/cargando-modal.component';


@NgModule({
  declarations: [CargandoModalComponent, ReloadFiltrosComponent, ReloadComponent, ReloadformComponent],
  exports: [ReloadComponent, ReloadformComponent, ReloadFiltrosComponent, CargandoModalComponent],
  imports: [
    CommonModule,
    SharedRoutingModule
  ]
})
export class SharedModule { }
