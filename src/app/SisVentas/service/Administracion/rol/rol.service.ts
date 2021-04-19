import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EnviromentService} from '../../enviroment.service';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  head = new HttpHeaders();
  private headers = this.head.append('Content-Type', 'application/json');

  constructor(
      private client: HttpClient,
      private url: EnviromentService
  ) { }

  createRol(rol) {
    return this.client.post(
        this.url.urlAddress + 'Rol',
        {rol},
        {headers: this.headers}
    );
  }

  getRol() {
    return this.client.get(
      this.url.urlAddress + 'Rol',
        {headers: this.headers}
    );
  }

  deleteRol(idRol) {
    return this.client.delete(
        this.url.urlAddress + 'Rol/' + idRol,
        {headers: this.headers}
    );
  }

  getRolById(idRol: number) {
    return this.client.get(
        this.url.urlAddress + 'Rol/' + idRol,
        {headers: this.headers}
    );
  }

  editRol(rol) {
    return this.client.put(
        this.url.urlAddress + 'Rol',
        {rol},
        {headers: this.headers}
    );
  }

  changeStatusRol(idRol) {
    return this.client.post(
        this.url.urlAddress + 'Rol/Status',
        {idRol},
        {headers: this.headers}
    );
  }

}
