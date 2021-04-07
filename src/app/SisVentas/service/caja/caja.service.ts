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

  Totales(params) {
    return this.httpClient.get(this.url.urlAddress + 'Caja/Administrar', { params , headers: this.headers}).toPromise();
  }
  Aperturar(caja) {
   return this.httpClient.post(this.url.urlAddress + 'Caja/Aperturar', { caja}, {headers: this.headers}).toPromise();
  }
  CerrarCaja(caja) {
    return this.httpClient.patch(this.url.urlAddress + 'Caja/CerrarCaja', {caja}, {headers: this.headers});
  }
  ValidarCaja(params) {
    return this.httpClient.get(this.url.urlAddress + 'Caja/ValidarCaja', { params , headers: this.headers}).toPromise();
  }
  ObtenerSaldoInicial(idCaja) {
    return this.httpClient.get(this.url.urlAddress + 'Caja/ObtenerSaldoInicial/' + idCaja, {headers: this.headers}).toPromise();
   }
  GuardarCorteDiario(detalleCorteCaja, corteCaja ) {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.post(this.url.urlAddress + 'Caja/GuardarCorteDiario', { detalleCorteCaja, corteCaja}, {headers: this.headers}).toPromise();
  }
  BuscarcortesXFechas(params) {
    return this.httpClient.get(this.url.urlAddress + 'Caja/SearXFechas', { params , headers: this.headers}).toPromise();
  }
}
