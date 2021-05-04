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
  httpHeaders = new HttpHeaders()
  .append('Content-Type', 'application/json')
  .append('Authorization',  'Bearer' + ' ' + localStorage.getItem('token'));

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
  CryptoJSAesDecrypt(passphrase, encryptedJsonString) {

    const objJson = JSON.parse(encryptedJsonString);

    const encrypted = objJson.ciphertext;
    const salt = CryptoJS.enc.Hex.parse(objJson.salt);
    const iv = CryptoJS.enc.Hex.parse(objJson.iv);

    const key = CryptoJS.PBKDF2(passphrase, salt, { hasher: CryptoJS.algo.SHA512, keySize: 64 / 8, iterations: 999});


    const decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: iv});

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
  public loginUser(userName, password) {
    return this.httpClient.post(this.url.urlAddress + 'LoginUser', {userName, password}, {headers: this.httpHeaders}).toPromise();
  }
  Logout() {
    const token = localStorage.getItem('token');
    const idUsuario = localStorage.getItem('idUsuario');
    return this.httpClient.post(this.url.urlAddress + 'LogoutUser', {idUsuario, token}, {headers: this.httpHeaders}).toPromise();
  }
  isLoggedInUser(): boolean {
    const authToken = localStorage.getItem('token');
    return (authToken != null) ? true : false;
  }
  sidebarObs(message: []) {
    this.sidebar.next(message);
  }
}
