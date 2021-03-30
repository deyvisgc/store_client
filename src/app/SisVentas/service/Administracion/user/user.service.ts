import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EnviromentService} from '../../enviroment.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  head = new HttpHeaders();
  private headers = this.head.append('Content-Type', 'application/json');

  constructor(
      private client: HttpClient,
      private url: EnviromentService,
  ) { }

  registerPeople(people) {
    return this.client.post(
        this.url.urlAddress + 'User',
        {people},
        {headers: this.headers},
    );
  }

  getUserInfo(idPerson: number) {
    return this.client.get(
      this.url.urlAddress + 'UserPerson/' + idPerson,
        {headers: this.headers}
    );
  }

  updateUser(user: any) {
    return this.client.put(
      this.url.urlAddress + 'User',
        {user},
        {headers: this.headers}
    );
  }
}
