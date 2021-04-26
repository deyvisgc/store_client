import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EnviromentService} from '../../enviroment.service';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  httpHeaders = new HttpHeaders()
  .append('Content-Type', 'application/json')
  .append('Authorization',  'Bearer' + ' ' + localStorage.getItem('token'));

  constructor(
      private client: HttpClient,
      private url: EnviromentService
  ) { }

  createRol(rol) {
    return this.client.post(this.url.urlAddress + 'CreateRol', {rol}, {headers: this.httpHeaders}).toPromise();
  }

  getRol() {
    return this.client.get(this.url.urlAddress + 'getRol', {headers: this.httpHeaders}).toPromise();
  }

  deleteRol(idRol) {
    return this.client.delete(
        this.url.urlAddress + 'Rol/' + idRol,
        {headers: this.httpHeaders}
    ).toPromise();
  }
  editRol(rol) {
    return this.client.put(
        this.url.urlAddress + 'Rol',
        {rol},
        {headers: this.httpHeaders}
    ).toPromise();
  }

  changeStatusRol(data) {
    return this.client.post(
        this.url.urlAddress + 'Rol/Status',
        {data},
        {headers: this.httpHeaders}
    ).toPromise();
  }

}
