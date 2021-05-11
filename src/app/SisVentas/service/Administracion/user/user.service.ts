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

  registerUserAndPerson(people) {
    return this.client.post( this.url.urlAddress + 'UserCreate', {people}, {headers: this.httpHeaders}).toPromise();
  }
  getUsers() {
    return this.client.get( this.url.urlAddress + 'User', {headers: this.httpHeaders}).toPromise();
  }
  getUserInfo(idUsers: number) {
    return this.client.get(this.url.urlAddress + 'getUserByIdPerson/' + idUsers, {headers: this.httpHeaders}).toPromise();
  }
  updateUser(user: any) {
    return this.client.put( this.url.urlAddress + 'ChangeUser', {user}, {headers: this.httpHeaders}).toPromise();
  }
  updatePassword(passwords: any) {
    return this.client.put(this.url.urlAddress + 'ChangePassword', {passwords} , {headers: this.httpHeaders}).toPromise();
  }
  searchUsuario(params) {
    return this.client.post(this.url.urlAddress + 'SearchUsuario', {params}, {headers: this.httpHeaders});
  }
  RecuperarPassword(params) {
    return this.client.put(this.url.urlAddress + 'RecuperarPassword', {params} , {headers: this.httpHeaders}).toPromise();
  }
  deleteUserandPeson(params) {
    return this.client.post(this.url.urlAddress + 'DeleteUsersandPerson', {params}, {headers: this.httpHeaders}).toPromise();
  }
  changeStatusPersonUsers(params) {
    return this.client.put( this.url.urlAddress + 'ChangeStatus', {params}, {headers: this.httpHeaders}
    ).toPromise();
  }

}
