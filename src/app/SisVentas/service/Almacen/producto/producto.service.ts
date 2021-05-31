import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnviromentService } from '../../enviroment.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(private httpClient: HttpClient, private url: EnviromentService) { }
  httpHeaders = new HttpHeaders()
  // .append('Content-Type', 'application/json')
  .append('Authorization',  'Bearer' + ' ' + localStorage.getItem('token'));
   Read(params) {
    return this.httpClient.get(this.url.urlAddress + 'obtener-producto', {params, headers: this.httpHeaders}).toPromise();
  }
   edit(params) {
    return this.httpClient.get(this.url.urlAddress + 'edit-producto', {params, headers: this.httpHeaders}).toPromise();
  }
   generarProducto(form) {
    return this.httpClient.post(this.url.urlAddress + 'create-product', form, {headers: this.httpHeaders}).toPromise();
  }
   Delete(id) {
    return this.httpClient.delete(this.url.urlAddress + 'delete-producto/' + id, {headers: this.httpHeaders}).toPromise();
  }
   SearchxType(data) {
    return this.httpClient.post(this.url.urlAddress + 'Almacen/Producto/SearchxType', {data}, {headers: this.httpHeaders});
  }
   ChangeStatus(data) {
    return this.httpClient.patch(this.url.urlAddress + 'ChangeStatus-proudcto', {data}, {headers: this.httpHeaders}).toPromise();
  }
  LastIdProducto() {
    return this.httpClient.get(this.url.urlAddress + 'obtener-last-idProducto', {headers: this.httpHeaders}).toPromise();
  }
  Exportar(params) {
    return this.httpClient.get(this.url.urlAddress + 'productos-exportar', {params , responseType: 'blob'}).toPromise();
  }
}
