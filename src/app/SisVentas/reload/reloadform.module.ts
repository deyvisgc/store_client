import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReloadformRoutingModule } from './reloadform-routing.module';
import { ReloadformComponent } from './reloadform/reloadform.component';


@NgModule({
  declarations: [ReloadformComponent],
  exports: [ReloadformComponent],
  imports: [
    CommonModule,
    ReloadformRoutingModule
  ]
})
export class ReloadformModule { }
