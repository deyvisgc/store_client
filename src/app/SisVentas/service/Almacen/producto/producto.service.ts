import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnviromentService } from '../../enviroment.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(private httpClient: HttpClient, private url: EnviromentService) { }
  httpHeaders = new HttpHeaders()
  .append('Content-Type', 'application/json')
  .append('Authorization',  'Bearer' + ' ' + localStorage.getItem('token'));
  public Read(params) {
    return this.httpClient.get(this.url.urlAddress + 'obtener-producto', {params, headers: this.httpHeaders}).toPromise();
  }
  public Readxid(id) {
    return this.httpClient.get(this.url.urlAddress + 'Almacen/Producto/' + id, {headers: this.httpHeaders});
  }
  public Registrar(data) {
    return this.httpClient.post(this.url.urlAddress + 'Almacen/Producto', {data}, {headers: this.httpHeaders});
  }
  public Delete(id) {
    return this.httpClient.delete(this.url.urlAddress + 'Almacen/Producto/' + id);
  }
  public Upddate(data) {
    return this.httpClient.patch(this.url.urlAddress + 'Almacen/Producto', {data}, {headers: this.httpHeaders});
  }
  public SearchxType(data) {
    return this.httpClient.post(this.url.urlAddress + 'Almacen/Producto/SearchxType', {data}, {headers: this.httpHeaders});
  }
  public changestatus(data) {
    return this.httpClient.patch(this.url.urlAddress + 'Almacen/Producto/changestatus', {data}, {headers: this.httpHeaders});
  }
}
