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
  public edit(params) {
    return this.httpClient.get(this.url.urlAddress + 'edit-producto', {params, headers: this.httpHeaders}).toPromise();
  }
  public Registrar(data) {
    return this.httpClient.post(this.url.urlAddress + 'create-product', {data}, {headers: this.httpHeaders}).toPromise();
  }
  public Delete(id) {
    return this.httpClient.delete(this.url.urlAddress + 'delete-producto/' + id, {headers: this.httpHeaders}).toPromise();
  }
  public Actualizar(data) {
    return this.httpClient.patch(this.url.urlAddress + 'update-producto', {data}, {headers: this.httpHeaders}).toPromise();
  }
  public SearchxType(data) {
    return this.httpClient.post(this.url.urlAddress + 'Almacen/Producto/SearchxType', {data}, {headers: this.httpHeaders});
  }
  public ChangeStatus(data) {
    return this.httpClient.patch(this.url.urlAddress + 'ChangeStatus-proudcto', {data}, {headers: this.httpHeaders}).toPromise();
  }
}
