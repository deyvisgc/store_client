import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnviromentService } from '../../enviroment.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private httpClient: HttpClient, private url: EnviromentService) { }
  httpHeaders = new HttpHeaders()
  .append('Content-Type', 'application/json')
  .append('Authorization',  'Bearer' + ' ' + localStorage.getItem('token'));
  public getCategoria(params) {
    return this.httpClient.get(this.url.urlAddress + 'obtener-categoria', {params, headers: this.httpHeaders}).toPromise();
  }
  public searchCategoria(params) {
    return this.httpClient.post(this.url.urlAddress + 'search-categoria', {params}, {headers: this.httpHeaders}).toPromise();
  }
  public getClaseSupe() {
    return this.httpClient.get(this.url.urlAddress + 'Almacen/Clase/superior', {headers: this.httpHeaders}).toPromise();
  }
  public ActualizarCate(data) {
    return this.httpClient.patch(this.url.urlAddress + 'Almacen/Clase/Actualizarcate', {data}, {headers: this.httpHeaders});
  }
  public ViewDetalleHijos(id) {
    return this.httpClient.get(this.url.urlAddress + 'Almacen/Clase/viewchild/' + id , {headers: this.httpHeaders});
  }
  public ChangestatusCate(data) {
    return this.httpClient.patch(this.url.urlAddress + 'Almacen/Clase/Changestatuscate', {data}, {headers: this.httpHeaders});
  }
  public ChangestatusCateRecursiva(data) {
    return this.httpClient.patch(this.url.urlAddress + 'Almacen/Clase/ChangestatusCateRecursiva', {data}, {headers: this.httpHeaders});
  }
  public filtrarxclasepadre(id) {
    return this.httpClient.get(this.url.urlAddress + 'Almacen/Clase/filtrarxclasepadre/' + id , {headers: this.httpHeaders});
  }
}
