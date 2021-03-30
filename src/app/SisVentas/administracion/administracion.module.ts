import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministracionRoutingModule } from './administracion-routing.module';
import { PrivilegioComponent } from './privilegio/privilegio.component';
import { RolComponent } from './rol/rol.component';
import { UsuarioComponent } from './usuario/usuario.component';
import {ReactiveFormsModule} from '@angular/forms';
import { ProveedorComponent } from './proveedor/proveedor.component';


@NgModule({
  declarations: [PrivilegioComponent, RolComponent, UsuarioComponent, ProveedorComponent],
    imports: [
        CommonModule,
        AdministracionRoutingModule,
        ReactiveFormsModule,
    ]
})
export class AdministracionModule { }
