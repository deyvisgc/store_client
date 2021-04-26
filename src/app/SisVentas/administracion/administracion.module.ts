import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministracionRoutingModule } from './administracion-routing.module';
import { PrivilegioComponent } from './privilegio/privilegio.component';
import { RolComponent } from './rol/rol.component';
import { UsuarioComponent } from './usuario/usuario.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { ReloadformComponent } from '../reload/reloadform/reloadform.component';


@NgModule({
  declarations: [PrivilegioComponent, RolComponent, UsuarioComponent, ProveedorComponent, ReloadformComponent],
    imports: [
        CommonModule,
        AdministracionRoutingModule,
        ReactiveFormsModule,
        FormsModule
    ]
})
export class AdministracionModule { }
