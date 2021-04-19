import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EnviromentService} from '../enviroment.service';
import * as CryptoJS from 'crypto-js';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private sidebar = new Subject<[]>();
  sidebarObs$ = this.sidebar.asObservable();
  head = new HttpHeaders();
  header = this.head.append(
    'Content-Type', 'application/json',
  );

  constructor(
      private httpClient: HttpClient,
      private url: EnviromentService
  ) { }

  CryptoJSAesEncrypt(keycript, plaintext) {
    const salt = CryptoJS.lib.WordArray.random(256);
    const iv = CryptoJS.lib.WordArray.random(16);
    const key = CryptoJS.PBKDF2(keycript, salt, { hasher: CryptoJS.algo.SHA512, keySize: 64 / 8, iterations: 999 });

    const encrypted = CryptoJS.AES.encrypt(plaintext, key, { iv: iv });
    const data = {
      ciphertext: CryptoJS.enc.Base64.stringify(encrypted.ciphertext),
      salt: CryptoJS.enc.Hex.stringify(salt),
      iv: CryptoJS.enc.Hex.stringify(iv)
    };
    return JSON.stringify(data);
  }
  public loginUser(userName, password) {
    return this.httpClient.post(this.url.urlAddress + 'LoginUser', {userName, password}, {headers: this.header}).toPromise();
  }
  Logout() {
    // tslint:disable-next-line:variable-name
    const api_token = localStorage.getItem('token');
    const idUsuario = localStorage.getItem('idUsuario');
    return this.httpClient.post(this.url.urlAddress + 'LogoutUser', { api_token, idUsuario }).toPromise();
  }
  headersfuncion() {
    const headerxauth = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer' + ' ' + localStorage.getItem('token'))
    };
    return headerxauth;
  }
  sidebarObs(message: []) {
    this.sidebar.next(message);
  }
}
