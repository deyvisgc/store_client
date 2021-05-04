import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { ReloadComponent } from '../../reload/reload/reload.component';
import { ReloadformComponent } from '../../reload/reloadform/reloadform.component';
import { ReloadFiltrosComponent } from '../../componenteshijos/reload-filtros/reload-filtros.component';


@NgModule({
  declarations: [ReloadFiltrosComponent, ReloadComponent, ReloadformComponent],
  exports: [ReloadComponent, ReloadformComponent, ReloadFiltrosComponent],
  imports: [
    CommonModule,
    SharedRoutingModule
  ]
})
export class SharedModule { }
