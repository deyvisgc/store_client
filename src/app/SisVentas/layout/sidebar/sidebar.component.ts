import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { PrivilegesService } from '../../service/Privileges/privileges.service';
import iziToast from 'izitoast';
declare const sendRespuesta: any;
import _ from 'lodash';

import { AuthenticationService } from '../../service/Authentication/authentication.service';
@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.sass']
})
export class SidebarComponent implements OnInit {
    SecretRol = 'K56QSxGeKImwBRmiY';
    rolName = '';
    userName = localStorage.getItem('usuario');
    tokenUser: string = localStorage.getItem('TOKEN_USER');
    submenuAdministracion: [];
    submenuCompra: [];
    submenuCaja: [];
    submenuAlmacen: [];
    submenuSangria: [];
    constructor(
        private privilege: PrivilegesService, private autser: AuthenticationService
    ) { }

    ngOnInit() {
        this.desencriptar();
        this.getPrivilegesByRol();
    }

    getPrivilegesByRol() {
        const idRol = localStorage.getItem('idRol');
        const params = {idRol};
        this.privilege.getPrivilegesByRol(params).then( res => {
            const rpta = sendRespuesta(res);
            const data = rpta.data.filter(f => f.pri_group === 'Almacen');
            this.submenuAlmacen = data;
            console.log('this.submenuAlmacen', this.submenuAlmacen);
            // this.tempPrivileges.push(rpta.data);
            // for (let i = 0; i < this.tempPrivileges.length; i++) {
            //     for (let j = i; j < this.tempPrivileges[i].length; j++) {
            //         if (!this.privileges.hasOwnProperty(this.tempPrivileges[i][j].pri_group)) {
            //             this.privileges[this.tempPrivileges[i][j].pri_group] = [];
            //         }
            //         this.privileges[this.tempPrivileges[i][j].pri_group].push({
            //             pri_access: this.tempPrivileges[i][j].pri_acces,
            //             pri_name: this.tempPrivileges[i][j].pri_nombre,
            //         });
            //     }
            // }
            // // tslint:disable-next-line:forin
            // for (const key in this.privileges) {
            //     this.privilegesGroup.push(key);
            //     this.privilegesRoute.push(this.privileges[key]);
            // }
            // console.log(this.privilegesRoute);
            // this.sidebarStatus = true;
            // rpta.data.forEach(element => {
            //     this.grupos.push(element.pri_group);
            //     this.privilegesGroup =  _.uniq(this.grupos);
            // });
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            console.log('entro');
        });
    }
    desencriptar() {
     const vm = this;
     const rol = localStorage.getItem('rol_name');
     vm.rolName = vm.autser.CryptoJSAesDecrypt(vm.SecretRol, rol);
    }
}
