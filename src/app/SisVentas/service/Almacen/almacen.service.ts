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
  public Clase(){
    return this.httpClient.get(this.url.urlAddress + 'Almacen/Clase', {headers: this.headers});
  }

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
  public Upddate(data) {
    return this.httpClient.patch(this.url.urlAddress + 'Almacen/Producto', {data}, {headers: this.headers});
  }

}
