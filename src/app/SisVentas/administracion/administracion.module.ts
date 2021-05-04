import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministracionRoutingModule } from './administracion-routing.module';
import { PrivilegioComponent } from './privilegio/privilegio.component';
import { RolComponent } from './rol/rol.component';
import { UsuarioComponent } from './usuario/usuario.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { PermisosComponent } from './permisos/permisos.component';
import { PerfilComponent } from './perfil/perfil.component';
import { HighlightDirective } from '../directives/highlight.directive';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { SharedModule } from '../shared-modulos/shared/shared.module';


@NgModule({
  declarations: [PrivilegioComponent, RolComponent, UsuarioComponent, ProveedorComponent,
                 PermisosComponent, PerfilComponent, HighlightDirective],
    imports: [
        CommonModule,
        AdministracionRoutingModule,
        ReactiveFormsModule,
        AutocompleteLibModule,
        FormsModule,
        SharedModule
    ]
})
export class AdministracionModule { }
