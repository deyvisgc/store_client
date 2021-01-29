import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TablesRoutingModule } from './tables-routing.module';
import { ChildRowComponent } from './child-row/child-row.component';
import { BasicTableComponent } from './basic-table/basic-table.component';
import { GroupTableComponent } from './group-table/group-table.component';
import { ExportTableComponent } from './export-table/export-table.component';
import { EditableTableComponent } from './editable-table/editable-table.component';
import { AdvanceTableComponent } from './advance-table/advance-table.component';
import { NgxDatatableComponent } from './ngx-datatable/ngx-datatable.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [ChildRowComponent, BasicTableComponent, GroupTableComponent, ExportTableComponent, EditableTableComponent, AdvanceTableComponent, NgxDatatableComponent],
  imports: [
    CommonModule,
    TablesRoutingModule,
    NgxDatatableModule
  ]
})
export class TablesModule { }
