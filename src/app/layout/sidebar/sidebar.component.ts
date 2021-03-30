import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PrivilegesService} from '../../SisVentas/service/Privileges/privileges.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.sass']
})
export class SidebarComponent implements OnInit {
    userName: string = btoa(localStorage.getItem('USER_NAME'));
    rolName: string = btoa(localStorage.getItem('NAME_ROL'));
    tokenUser: string = localStorage.getItem('TOKEN_USER');
    privileges: any[] = [];
    tempPrivileges: any[] = [];
    tempKeys: any[] = [];
    sidebarStatus = false;

    privilegesGroup: any[] = [];
    privilegesRoute: any[] = [];

    constructor(
        private httpClient: HttpClient,
        private privilege: PrivilegesService,
    ) { }

    ngOnInit() {
        if (this.tokenUser) {
            this.getPrivilegesByRol();
        }
    }

    getPrivilegesByRol() {
        const idRol = localStorage.getItem('ROL');

        this.privilege.getPrivilegesByRol(idRol).subscribe(
            resp => {
                this.tempPrivileges.push(resp);

                for (let i = 0; i < this.tempPrivileges.length; i++) {
                    for (let j = i; j < this.tempPrivileges[i].length; j++) {
                        if (!this.privileges.hasOwnProperty(this.tempPrivileges[i][j].pri_group)) {
                            this.privileges[this.tempPrivileges[i][j].pri_group] = [];
                        }
                        this.privileges[this.tempPrivileges[i][j].pri_group].push({
                            pri_access: this.tempPrivileges[i][j].pri_acces,
                            pri_name: this.tempPrivileges[i][j].pri_nombre,
                        });
                    }
                }

                for (const key in this.privileges) {
                    this.privilegesGroup.push(key);
                    this.privilegesRoute.push(this.privileges[key]);
                }
                this.sidebarStatus = true;
            },
            error => {
                console.error(error);
            }
        );
    }
}
