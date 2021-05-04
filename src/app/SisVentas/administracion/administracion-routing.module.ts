import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PrivilegioComponent} from './privilegio/privilegio.component';
import {RolComponent} from './rol/rol.component';
import {UsuarioComponent} from './usuario/usuario.component';
import {ProveedorComponent} from './proveedor/proveedor.component';
import { PermisosComponent } from './permisos/permisos.component';
import { PerfilComponent } from './perfil/perfil.component';


const routes: Routes = [
  {
    path: 'privilegios',
    component: PrivilegioComponent
  },
  {
    path: 'permisos',
    component: PermisosComponent
  },
  {
    path: 'usuarios',
    component: UsuarioComponent
  },
  {
    path: 'proveedores',
    component: ProveedorComponent
  },
  {
    path: 'perfil',
    component: PerfilComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionRoutingModule { }
