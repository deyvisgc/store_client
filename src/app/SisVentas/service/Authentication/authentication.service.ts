import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EnviromentService} from '../enviroment.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  head = new HttpHeaders();
  header = this.head.append(
    'Content-Type', 'application/json',
  );

  constructor(
      private httpClient: HttpClient,
      private url: EnviromentService
  ) { }

  public loginUser(userName, userPassword) {
    return this.httpClient.post(
        this.url.urlAddress + 'LoginUser',
        {userName, userPassword},
        {headers: this.header});
  }
}
