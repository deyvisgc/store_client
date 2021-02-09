import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnviromentService } from '../enviroment.service';
@Injectable({
  providedIn: 'root'
})
export class AlmacenService {
  _headers = new HttpHeaders();
  headers = this._headers.append('Content-Type', 'application/json');

  constructor(private httpClient: HttpClient, private url: EnviromentService ) { }

  public Lote() {
    console.log('url,', this.url.urlAddress);
    return this.httpClient.get(this.url.urlAddress + 'Almacen/Lote', {headers: this.headers});
  }
  //  servicios categorias padre e hijos
  public RegistraClase(data) {
    return this.httpClient.post(this.url.urlAddress + 'Almacen/Clase', {data}, {headers: this.headers});
  }
  public getClaseSupe() {
    return this.httpClient.get(this.url.urlAddress + 'Almacen/Clase/superior', {headers: this.headers});
  }
  public getClaserecursiva() {
    return this.httpClient.get(this.url.urlAddress + 'Almacen/Clase/recursiveChildren', {headers: this.headers});
  }
  public ObtenerclasPadreYhijo(idpadre) {
    return this.httpClient.get(this.url.urlAddress + 'Almacen/Clase/ObtenerclasPadreYhijo/' + idpadre, {headers: this.headers});
  }
  public ActualizarclasPadreYhijo(data) {
    return this.httpClient.patch(this.url.urlAddress + 'Almacen/Clase/ActualizarclasPadreYhijo', {data}, {headers: this.headers});
  }
  //  servicios categorias
  public ActualizarCate(data) {
    return this.httpClient.patch(this.url.urlAddress + 'Almacen/Clase/Actualizarcate', {data}, {headers: this.headers});
  }
  public ViewDetalleHijos(id) {
    return this.httpClient.get(this.url.urlAddress + 'Almacen/Clase/viewchild/' + id , {headers: this.headers});
  }
  public ChangestatusCate(data) {
    return this.httpClient.patch(this.url.urlAddress + 'Almacen/Clase/Changestatuscate', {data}, {headers: this.headers});
  }
  public ChangestatusCateRecursiva(data) {
    return this.httpClient.patch(this.url.urlAddress + 'Almacen/Clase/ChangestatusCateRecursiva', {data}, {headers: this.headers});
  }
  public filtrarxclasepadre(id) {
    return this.httpClient.get(this.url.urlAddress + 'Almacen/Clase/filtrarxclasepadre/' + id , {headers: this.headers});
  }

  //  servicios unidad
  public UnidadMedida() {
    return this.httpClient.get(this.url.urlAddress + 'Almacen/Unidad', {headers: this.headers});

  }
  public Read() {
    return this.httpClient.get(this.url.urlAddress + 'Almacen/Producto', {headers: this.headers});
  }
  public Readxid(id) {
    return this.httpClient.get(this.url.urlAddress + 'Almacen/Producto/' + id, {headers: this.headers});
  }
  public Registrar(data) {
    return this.httpClient.post(this.url.urlAddress + 'Almacen/Producto', {data}, {headers: this.headers});
  }
  public Delete(id) {
    return this.httpClient.delete(this.url.urlAddress + 'Almacen/Producto/' + id);
  }
  public Upddate(data) {
    return this.httpClient.patch(this.url.urlAddress + 'Almacen/Producto', {data}, {headers: this.headers});
  }
  public SearchxType(data) {
    return this.httpClient.post(this.url.urlAddress + 'Almacen/Producto/SearchxType', {data}, {headers: this.headers});
  }
  public changestatus(data) {
    return this.httpClient.patch(this.url.urlAddress + 'Almacen/Producto/changestatus', {data}, {headers: this.headers});
  }
}
