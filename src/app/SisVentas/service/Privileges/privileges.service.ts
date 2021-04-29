import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EnviromentService} from '../enviroment.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PrivilegesService {
  httpHeaders = new HttpHeaders()
                .append('Content-Type', 'application/json')
                .append('Authorization',  'Bearer' + ' ' + localStorage.getItem('token'));

  constructor(
      private httpClient: HttpClient,
      private url: EnviromentService,
  ) { }
  private subject = new Subject<any>();

  sendMessage(message: []) {
      this.subject.next({ something: message });
  }

  clearMessage() {
      this.subject.next();
  }

  getMessage(): Observable<any> {
      return this.subject.asObservable();
  }
  getPrivilegesByRol(params) {
    return this.httpClient.get(this.url.urlAddress + 'PrivilegiosRol', {params , headers: this.httpHeaders}).toPromise();
  }
  getIcon() {
    return this.httpClient.get(this.url.urlAddress + 'GetIcon', {headers: this.httpHeaders}).toPromise();
  }
  getGrupo() {
    return this.httpClient.get(this.url.urlAddress + 'GetGrupo', {headers: this.httpHeaders}).toPromise();
  }
  getPrivilegios() {
    return this.httpClient.get(this.url.urlAddress + 'GetPrivilegios', {headers: this.httpHeaders}).toPromise();
  }
  AddGrupos(grupos) {
    return this.httpClient.post(this.url.urlAddress + 'AddGrupos', {grupos}, {headers: this.httpHeaders}).toPromise();
  }
  UpdatePrivilegios(data) {
    return this.httpClient.patch(this.url.urlAddress + 'UpdatePrivilegios', {data}, {headers: this.httpHeaders}).toPromise();
  }
  ChangeStatus(data) {
    return this.httpClient.patch(this.url.urlAddress + 'ChangeStatus', {data}, {headers: this.httpHeaders}).toPromise();
  }
  getGrupoDetalle(idPrivilegio) {
    return this.httpClient.get(this.url.urlAddress + 'GetGrupoDetalle/' + idPrivilegio, {headers: this.httpHeaders}).toPromise();
  }
  DeletePrivilegioGrupo(data) {
    return this.httpClient.post(this.url.urlAddress + 'DeletePrivilegioGrupo', {data}, {headers: this.httpHeaders}).toPromise();
  }
}
