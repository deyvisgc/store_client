import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { PrivilegesService } from '../../service/Privileges/privileges.service';
import iziToast from 'izitoast';
declare const sendRespuesta: any;
import _ from 'lodash';

import { AuthenticationService } from '../../service/Authentication/authentication.service';
import { Router } from '@angular/router';
import { DisplayreportServiceService } from '../../service/displayreport-service.service';
@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    SecretRol = 'K56QSxGeKImwBRmiY';
    expanded = new Array(3).fill(false);
    datalis: string;
    allReportCategories: any[];
    reportsubCategory: any[];
    reportByCategoryId: any[];
    allReportsubCategory: any[];
    reportCategoryIdparam: string;
    rolName = '';
    userName = localStorage.getItem('usuario');
    tokenUser: string = localStorage.getItem('TOKEN_USER');
    lista: any [];
    constructor(
        private privilege: PrivilegesService, private autser: AuthenticationService,
        public http: HttpClient, private _router: Router,
        private _displayreport: DisplayreportServiceService
    ) { }

    ngOnInit() {
        // this.privilege.getallReportCategories();
        this.getPrivilegesByRol();
        // this.allReportCategories = this.privilege.getallReportCategories().map((e) => {
        //     e.collapse = false;
        //     return e;
        // });
    }
    toggleAccordian(event, index, rep) {
        this.reportByCategoryId = [];
        this.reportByCategoryId = this.lista.filter(reportsubCategory => reportsubCategory.id_Padre === rep.id_privilegio);
        console.log('this.reportByCategoryId', this.reportByCategoryId);
        if (this.allReportCategories[index].collapse) {
            this.allReportCategories[index].collapse = false;
        } else {
            this.allReportCategories.forEach((element, index1) => {
                this.allReportCategories[index1].collapse = false;
            });
            this.allReportCategories[index].collapse = true;
        }
    }
    getPrivilegesByRol() {
        const idRol = localStorage.getItem('idRol');
        const params = {idRol};
        this.allReportCategories = [];
        const arra = [];
        this.privilege.getPrivilegesByRol(params).then( res => {
            const rpta = sendRespuesta(res);
            rpta.data.privilegiosGrupo.data.forEach((element, index) => {
                rpta.data.privilegiosGrupo.data[index].collapse = false;
                this.allReportCategories = rpta.data.subPrivilegios.forEach(f => {
                    if (element.id_privilegio === f.id_Padre) {
                       arra.push(element);
                    }
                });
            });
            this.allReportCategories = _.uniqBy(arra, 'id_privilegio');
            console.log('arra', this.allReportCategories);
            // this.allReportCategories = rpta.data.privilegiosGrupo.data.map((e) => {
            //     // e.collapse = false;
            //   const data =  rpta.data.subPrivilegios.filter(f => f.id_Padre === e.id_privilegio);
            //   if (data.length > 0) {
            //       return data;
            //   }
            // });
            this.lista = rpta.data.subPrivilegios;
            console.log('privilegio', rpta.data.subPrivilegios);
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
    GetreportByCategoryId(id: string) {
        console.log(this.lista);
        return this.lista.filter(reportsubCategory => reportsubCategory.id_Padre === id);
    }
}