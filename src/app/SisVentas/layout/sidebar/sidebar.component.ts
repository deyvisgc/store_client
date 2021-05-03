import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { PrivilegesService } from '../../service/Privileges/privileges.service';
import iziToast from 'izitoast';
declare const sendRespuesta: any;
import _ from 'lodash';

import { AuthenticationService } from '../../service/Authentication/authentication.service';
import { Router } from '@angular/router';
@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    SecretRol = 'K56QSxGeKImwBRmiY';
    grupo: any[];
    privilegio: any[];
    rolName = '';
    userName = localStorage.getItem('usuario');
    tokenUser: string = localStorage.getItem('TOKEN_USER');
    lista: any [];
    constructor(
        private privilege: PrivilegesService, private autser: AuthenticationService,
        public http: HttpClient
    ) { }

    ngOnInit() {
        this.getPrivilegesByRol();
    }
    toggleAccordian(index, rep) {
        this.privilegio = [];
        this.privilegio = this.lista.filter(reportsubCategory => reportsubCategory.id_Padre === rep.id_privilegio);
        if (this.grupo[index].collapse) {
            this.grupo[index].collapse = false;
        } else {
            this.grupo.forEach((element, index1) => {
                this.grupo[index1].collapse = false;
            });
            this.grupo[index].collapse = true;
        }
    }
    getPrivilegesByRol() {
        const idRol = localStorage.getItem('idRol');
        const params = {idRol};
        this.grupo = [];
        const arra = [];
        this.privilege.getPrivilegesByRol(params).then( res => {
            const rpta = sendRespuesta(res);
            rpta.data.privilegiosGrupo.data.forEach((element, index) => {
                rpta.data.privilegiosGrupo.data[index].collapse = false;
                this.grupo = rpta.data.subPrivilegios.forEach(f => {
                    if (element.id_privilegio === f.id_Padre) {
                       arra.push(element);
                    }
                });
            });
            this.grupo = _.uniqBy(arra, 'id_privilegio');
            this.lista = rpta.data.subPrivilegios;
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
    Getprivilegio(id: string) {
        return this.lista.filter(reportsubCategory => reportsubCategory.id_Padre === id);
    }
}