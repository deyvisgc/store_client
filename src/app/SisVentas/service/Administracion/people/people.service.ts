import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EnviromentService} from '../../enviroment.service';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  head = new HttpHeaders();
  private headers = this.head.append('Content-Type', 'application/json');

  constructor(
      private client: HttpClient,
      private url: EnviromentService
  ) { }

  getPeopleInfo() {
    return this.client.get(
        this.url.urlAddress + 'Person',
        {headers: this.headers},
    );
  }

  getPersonById(idPerson: number) {
    return this.client.get(
        this.url.urlAddress + 'Person/' + idPerson,
        {headers: this.headers},
    );
  }

  updatePerson(person) {
    return this.client.put(
        this.url.urlAddress + 'Person',
        {person},
        {headers: this.headers}
    );
  }

  disabledPerson(idPerson: number) {
    return this.client.delete(
        this.url.urlAddress + 'Person/' + idPerson,
        {headers: this.headers}
    );
  }

  changeStatusPerson(idPerson: number) {
    return this.client.post(
        this.url.urlAddress + 'PersonUser',
        {idPerson},
        {headers: this.headers}
    );
  }

  createSupplierPerson(person: any) {
    return this.client.post(
      this.url.urlAddress + 'Person',
        {person},
        {headers: this.headers},
    );
  }
}


