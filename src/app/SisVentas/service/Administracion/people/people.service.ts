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
    return this.client.get( this.url.urlAddress + 'obtener-person', {headers: this.httpHeaders}).toPromise();
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
  createPerson(person: any) {
    return this.client.post(
      this.url.urlAddress + 'crear-person',
        {person},
        {headers: this.httpHeaders},
    ).toPromise();
  }
}


