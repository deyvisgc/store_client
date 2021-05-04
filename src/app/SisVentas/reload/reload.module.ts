import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReloadRoutingModule } from './reload-routing.module';
import { ReloadformComponent } from './reloadform/reloadform.component';
import { ReloadComponent } from './reload/reload.component';
import { CargandoModalComponent } from './cargando-modal/cargando-modal.component';
import { ReloadFiltrosComponent } from './reload-filtros/reload-filtros.component';

@NgModule({
  declarations: [CargandoModalComponent, ReloadformComponent, ReloadComponent, ReloadFiltrosComponent],
  exports: [CargandoModalComponent, ReloadformComponent, ReloadComponent, ReloadFiltrosComponent],
  imports: [
    CommonModule,
    ReloadRoutingModule
  ]
})
export class ReloadModule { }
