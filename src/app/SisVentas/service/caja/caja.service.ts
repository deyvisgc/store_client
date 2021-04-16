import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { EnviromentService } from '../enviroment.service';

@Injectable({
  providedIn: 'root'
})
export class CajaService {
  // tslint:disable-next-line:variable-name
  _headers = new HttpHeaders();
  headers = this._headers.append('Content-Type', 'application/json');
  constructor(private httpClient: HttpClient, private url: EnviromentService) { }
  private lunes = new Subject<[]>();
  private martes = new Subject<[]>();
  private miercoles = new Subject<[]>();
  private jueves = new Subject<[]>();
  private viernes = new Subject<boolean>();
  private fechas = new BehaviorSubject({fechaDesde: '', fechaHasta: '', typeCorte: ''});
  fechaData = this.fechas.asObservable();

  lunesarrayObs$ = this.lunes.asObservable();
  MartesarrayObs$ = this.martes.asObservable();
  MiercolesrrayObs$ = this.miercoles.asObservable();
  juevesrrayObs$ = this.jueves.asObservable();
  viernesrrayObs$ = this.viernes.asObservable();
  changeFechas(data: any) {
    this.fechas.next(data);
  }
   obtenerCorteLunes(message: []) {
    this.lunes.next(message);
  }
  obtenerCorteMartes(message: []) {
    this.martes.next(message);
  }
  obtenerCorteMiercoles(message: []) {
    this.miercoles.next(message);
  }

  obtenerCorteJueves(message: []) {
    this.jueves.next(message);
  }
  obtenerCorteViernes(message: boolean) {
    this.viernes.next(message);
  }

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
  GuardarCorteSemanal(detalleCorteCaja, corteCaja ) {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.post(this.url.urlAddress + 'Caja/GuardarCorteSemanal', { detalleCorteCaja, corteCaja}, {headers: this.headers}).toPromise();
  }
  BuscarcortesXFechas(params) {
    return this.httpClient.get(this.url.urlAddress + 'Caja/SearXFechas', { params , headers: this.headers}).toPromise();
  }
  ObtenerTotalesArqueo(params) {
    return this.httpClient.get(this.url.urlAddress + 'Caja/Arequeo/ObtenerTotalesArqueo', { params , headers: this.headers}).toPromise();
  }
  GuardarArqueo(params) {
    return this.httpClient.post(this.url.urlAddress + 'Caja/Arequeo/GuardarArqueo', {params}, {headers: this.headers}).toPromise();
  }
}
