import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { EnviromentService } from '../enviroment.service';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  // tslint:disable-next-line:variable-name
  _headers = new HttpHeaders();
  headers = this._headers.append('Content-Type', 'application/json');
  constructor(private httpClient: HttpClient, private url: EnviromentService) { }
  Inventario(params) {
    return this.httpClient.get(this.url.urlAddress + 'Reportes/Inventario', {params, headers: this.headers}).toPromise();
   }
   pdf(): Observable<any> {
    // tslint:disable-next-line:no-unused-expression
    return this.httpClient.get(this.url.urlAddress + 'Reportes/Pdf', {responseType: 'blob'});
  }
   ExportarExcelInventario(params) {
    return this.httpClient.get(this.url.urlAddress + 'Reportes/Exprotar/Inventario', {params, responseType: 'blob'});
   }
   probando() {
    return this.httpClient.get(this.url.urlAddress + 'Reportes/probar', {headers: this.headers}).toPromise();
   }
   // sangria
   AddSangria(sangria) {
     return this.httpClient.post(this.url.urlAddress + 'Reportes/AddSangria', {sangria}, {headers: this.headers}).toPromise();
   }
   GetSangria(params) {
    return this.httpClient.get(this.url.urlAddress + 'Reportes/GetSangria', {params, headers: this.headers}).toPromise();
   }
   deleteSngria(id) {
    return this.httpClient.post(this.url.urlAddress + 'Reportes/DeleteSangria', { id, headers: this.headers}).toPromise();
   }
   ExportarExcelSangria(params) {
    return this.httpClient.get(this.url.urlAddress + 'Reportes/Exprotar/Sangria', {params, responseType: 'blob'});
   }
  
}
