import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnviromentService } from '../../enviroment.service';

@Injectable({
  providedIn: 'root'
})
export class LoteService {

  constructor(private httpClient: HttpClient, private url: EnviromentService) { }
  httpHeaders = new HttpHeaders()
  .append('Content-Type', 'application/json')
  .append('Authorization',  'Bearer' + ' ' + localStorage.getItem('token'));
   getLote(params) {
    return this.httpClient.get(this.url.urlAddress + 'obtener-lotes', {params, headers: this.httpHeaders}).toPromise();
  }
   SearchLote(params) {
    return this.httpClient.post(this.url.urlAddress + 'search-lotes', {params}, {headers: this.httpHeaders}).toPromise();
  }
   RegistrarLote(data) {
    return this.httpClient.post(this.url.urlAddress + 'Almacen/Lote', {data}, {headers: this.httpHeaders});
  }
   ActualizarLote(data) {
    return this.httpClient.patch(this.url.urlAddress + 'Almacen/Lote', {data}, {headers: this.httpHeaders});
  }
   DeleteLote(id) {
    return this.httpClient.delete(this.url.urlAddress + 'Almacen/Lote/' + id);
  }
   ChangeStatusLote(data) {
    return this.httpClient.patch(this.url.urlAddress + 'Almacen/Lote/ChangestatusLote', {data}, {headers: this.httpHeaders});
  }
  ObtenerCodeLote(params) {
    return this.httpClient.get(this.url.urlAddress + 'obtener-codigo-lote/', {params, headers: this.httpHeaders}).toPromise();
  }
}
