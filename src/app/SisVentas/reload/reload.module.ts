import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReloadRoutingModule } from './reload-routing.module';
import { ReloadformComponent } from './reloadform/reloadform.component';
import { ReloadComponent } from './reload/reload.component';


@NgModule({
  declarations: [ReloadformComponent, ReloadComponent],
  exports: [ReloadformComponent, ReloadComponent],
  imports: [
    CommonModule,
    ReloadRoutingModule
  ]
})
export class ReloadModule { }
