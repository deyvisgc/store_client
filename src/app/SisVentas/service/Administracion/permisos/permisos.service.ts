import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnviromentService } from '../../enviroment.service';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {
  httpHeaders = new HttpHeaders()
  .append('Content-Type', 'application/json')
  .append('Authorization',  'Bearer' + ' ' + localStorage.getItem('token'));
  constructor( private httpClient: HttpClient, private url: EnviromentService) { }
  Guardar(permisos) {
    return this.httpClient.post(this.url.urlAddress + 'Guardar', {permisos}, {headers: this.httpHeaders}).toPromise();
  }
  List() {
    return this.httpClient.get(this.url.urlAddress + 'ListPermisos', {headers: this.httpHeaders}).toPromise();
  }
  delete(idPermisos) {
    return this.httpClient.post(
        this.url.urlAddress + 'deletePermisos/', {idPermisos}, {headers: this.httpHeaders}
    ).toPromise();
  }
}
