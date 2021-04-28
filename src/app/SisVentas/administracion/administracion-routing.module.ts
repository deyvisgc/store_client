import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PrivilegioComponent} from './privilegio/privilegio.component';
import {RolComponent} from './rol/rol.component';
import {UsuarioComponent} from './usuario/usuario.component';
import {ProveedorComponent} from './proveedor/proveedor.component';
import { PermisosComponent } from './permisos/permisos.component';


const routes: Routes = [
  {
    path: 'Privilegios',
    component: PrivilegioComponent
  },
  {
    path: 'Permisos',
    component: PermisosComponent
  },
  {
    path: 'Usuarios',
    component: UsuarioComponent
  },
  {
    path: 'Proveedores',
    component: ProveedorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionRoutingModule { }
