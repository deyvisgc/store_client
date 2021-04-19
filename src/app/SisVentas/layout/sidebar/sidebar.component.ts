import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { PrivilegesService } from '../../service/Privileges/privileges.service';
import iziToast from 'izitoast';
declare const sendRespuesta: any;
import _ from 'lodash';
@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.sass']
})
export class SidebarComponent implements OnInit {
    userName: string = btoa(localStorage.getItem('USER_NAME'));
    rolName: string = btoa(localStorage.getItem('NAME_ROL'));
    tokenUser: string = localStorage.getItem('TOKEN_USER');
    esconder = false;
    privileges: any[] = [];
    tempPrivileges: any[] = [];
    tempKeys: any[] = [];
    sidebarStatus = false;

    privilegesGroup: any[] = [];
    privilegesRoute: any[] = [];
    grupos = [];
    constructor(
        private httpClient: HttpClient,
        private privilege: PrivilegesService,
    ) { }

    ngOnInit() {
        this.getPrivilegesByRol();
    }

    getPrivilegesByRol() {
        const idRol = localStorage.getItem('idRol');
        const params = {idRol};
        this.privilege.getPrivilegesByRol(params).then( res => {
            this.grupos = [];
            const rpta = sendRespuesta(res);
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
            rpta.data.forEach(element => {
                this.grupos.push(element.pri_group);
                this.privilegesGroup =  _.uniq(this.grupos);
            });
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            console.log('entro');
        });
    }
    submenu(val) {
        // if (val === 'Compras') {
        //     console.log(this.contMenu);
        //     if (this.contMenu === 0) {
        //         console.log('deyvis');
        //         this.esconder = true;
        //         this.contMenu += 1;
        //     } else {
        //         this.esconder = false;
        //     }
        // }
    }
}
