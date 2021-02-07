import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EnviromentService} from '../enviroment.service';

@Injectable({
  providedIn: 'root'
})
export class PrivilegesService {
  httpHeaders = new HttpHeaders();
  header = this.httpHeaders.append(
    'Content-Type', 'application/json'
  );

  constructor(
      private httpClient: HttpClient,
      private url: EnviromentService,
  ) { }

  public getPrivilegesByRol(idRol) {
    return this.httpClient.post(
        this.url.urlAddress + 'PrivilegiosRol',
        {idRol},
        {headers: this.header}
    );
  }
}
