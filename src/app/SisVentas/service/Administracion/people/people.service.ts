import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EnviromentService} from '../../enviroment.service';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  httpHeaders = new HttpHeaders()
  .append('Content-Type', 'application/json')
  .append('Authorization',  'Bearer' + ' ' + localStorage.getItem('token'));

  constructor(
      private client: HttpClient,
      private url: EnviromentService
  ) { }

  getPeopleInfo() {
    return this.client.get(
        this.url.urlAddress + 'Person',
        {headers: this.httpHeaders},
    );
  }

  getPersonById(idPerson: number) {
    return this.client.get(
        this.url.urlAddress + 'Person/' + idPerson,
        {headers: this.httpHeaders},
    );
  }

  updatePerson(person) {
    return this.client.put(this.url.urlAddress + 'Person', {person}, {headers: this.httpHeaders}).toPromise();
  }

  disabledPerson(idPerson: number) {
    return this.client.delete(
        this.url.urlAddress + 'Person/' + idPerson,
        {headers: this.httpHeaders}
    );
  }

  changeStatusPerson(idPerson: number) {
    return this.client.post(
        this.url.urlAddress + 'PersonUser',
        {idPerson},
        {headers: this.httpHeaders}
    );
  }

  createSupplierPerson(person: any) {
    return this.client.post(
      this.url.urlAddress + 'Person',
        {person},
        {headers: this.httpHeaders},
    );
  }
}


