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
        this.url.urlAddress + 'obtener-personById/' + idPerson,
        {headers: this.httpHeaders},
    ).toPromise();
  }
  updatePerson(person) {
    return this.client.put(this.url.urlAddress + 'update-person', {person}, {headers: this.httpHeaders}).toPromise();
  }
  changeStatusPerson(person) {
    return this.client.put(this.url.urlAddress + 'update-status', {person}, {headers: this.httpHeaders}).toPromise();
  }
  deletePerson(idPerson: number) {
    return this.client.post( this.url.urlAddress + 'delete-person', {idPerson}, {headers: this.httpHeaders}).toPromise();
  }
  createPerson(person: any) {
    return this.client.post(
      this.url.urlAddress + 'crear-person',
        {person},
        {headers: this.httpHeaders},
    ).toPromise();
  }
}


