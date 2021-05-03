import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EnviromentService} from '../../enviroment.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  httpHeaders = new HttpHeaders()
  .append('Content-Type', 'application/json')
  .append('Authorization',  'Bearer' + ' ' + localStorage.getItem('token'));

  constructor(
      private client: HttpClient,
      private url: EnviromentService,
  ) { }

  registerPeople(people) {
    return this.client.post(
        this.url.urlAddress + 'User',
        {people},
        {headers: this.httpHeaders},
    );
  }

  getUserInfo(idUsers: number) {
    return this.client.get(this.url.urlAddress + 'UserPerson/' + idUsers, {headers: this.httpHeaders}).toPromise();
  }
  updateUser(user: any) {
    return this.client.put(
      this.url.urlAddress + 'User',
        {user},
        {headers: this.httpHeaders}
    );
  }
  updatePassword(passwords: any) {
    return this.client.put(this.url.urlAddress + 'ChangePassword', {passwords} , {headers: this.httpHeaders}).toPromise();
  }
  updateUsuario(usuario: any) {
    return this.client.put(this.url.urlAddress + 'ChangeUsuario', {usuario} , {headers: this.httpHeaders}).toPromise();
  }
}
