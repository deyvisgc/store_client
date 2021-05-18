import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnviromentService } from '../../enviroment.service';

@Injectable({
  providedIn: 'root'
})
export class UnidadMedidaService {
  constructor(private httpClient: HttpClient, private url: EnviromentService) { }
  httpHeaders = new HttpHeaders()
  .append('Content-Type', 'application/json')
  .append('Authorization',  'Bearer' + ' ' + localStorage.getItem('token'));
  public GetUnidadMedida(params) {
    return this.httpClient.get(this.url.urlAddress + 'obtener-unidad-medida', {params, headers: this.httpHeaders}).toPromise();
  }
  public SearchUnidadMedida(params) {
    return this.httpClient.post(this.url.urlAddress + 'search-unidad-medida', {params}, {headers: this.httpHeaders}).toPromise();
  }
  public RegistrarUnidad(data) {
    return this.httpClient.post(this.url.urlAddress + 'Almacen/Unidad', {data}, {headers: this.httpHeaders});
  }
  public ActualizarUnidad(data) {
    return this.httpClient.patch(this.url.urlAddress + 'Almacen/Unidad', {data}, {headers: this.httpHeaders});
  }
  public DeleteUnidad(id) {
    return this.httpClient.delete(this.url.urlAddress + 'Almacen/Unidad/' + id);
  }
  public ChangeStatusUnidad(data) {
    return this.httpClient.patch(this.url.urlAddress + 'Almacen/Unidad/ChangestatusUnidad', {data}, {headers: this.httpHeaders});
  }
}
