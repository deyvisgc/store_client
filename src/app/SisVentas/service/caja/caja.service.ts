import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnviromentService } from '../enviroment.service';

@Injectable({
  providedIn: 'root'
})
export class CajaService {
  // tslint:disable-next-line:variable-name
  _headers = new HttpHeaders();
  headers = this._headers.append('Content-Type', 'application/json');
  constructor(private httpClient: HttpClient, private url: EnviromentService) { }

  Totales(idPersona) {
    return this.httpClient.get(this.url.urlAddress + 'Caja/Administrar/' + idPersona , {headers: this.headers}).toPromise();
  }
}
