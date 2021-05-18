import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComprasRoutingModule } from './compras-routing.module';
import { IndexComponent } from './index/index.component';
import { SelectproductoComponent } from '../componenteshijos/selectproducto/selectproducto.component';
import { ProvedorselectComponent } from '../componenteshijos/provedorselect/provedorselect.component';
import { FormsModule } from '@angular/forms';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgxPaginationModule } from 'ngx-pagination';
// tslint:disable-next-line:max-line-length
import { SharedModule } from '../shared-modulos/shared/shared.module';

@NgModule({
  declarations: [IndexComponent, SelectproductoComponent, ProvedorselectComponent],
  imports: [
    CommonModule,
    AutocompleteLibModule,
    ComprasRoutingModule,
    NgxPaginationModule,
    SharedModule,
    FormsModule
  ]
})
export class ComprasModule { }
