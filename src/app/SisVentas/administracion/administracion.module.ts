import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministracionRoutingModule } from './administracion-routing.module';
import { PrivilegioComponent } from './privilegio/privilegio.component';
import { RolComponent } from './rol/rol.component';
import { UsuarioComponent } from './usuario/usuario.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { ReloadformComponent } from '../reload/reloadform/reloadform.component';
import { PermisosComponent } from './permisos/permisos.component';
import { ReloadComponent } from '../almacen/reload/reload.component';
import { PerfilComponent } from './perfil/perfil.component';
import { HighlightDirective } from '../directives/highlight.directive';
import { FilterPipe } from '../pipes/filter.pipe';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';



@NgModule({
  declarations: [PrivilegioComponent, RolComponent, UsuarioComponent, ProveedorComponent, ReloadformComponent, PermisosComponent, 
                 ReloadComponent, PerfilComponent, HighlightDirective, FilterPipe],
    imports: [
        CommonModule,
        AdministracionRoutingModule,
        ReactiveFormsModule,
        AutocompleteLibModule,
        FormsModule
    ]
})
export class AdministracionModule { }
