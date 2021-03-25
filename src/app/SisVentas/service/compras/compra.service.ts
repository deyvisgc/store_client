import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { EnviromentService } from '../enviroment.service';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  _headers = new HttpHeaders();
  headers = this._headers.append('Content-Type', 'application/json');
  private listEmpresa = new Subject<boolean>(); // creo un nuevo objeto con tun type boolean para obtener un mensaje
  // tslint:disable-next-line:max-line-length
  listEmpresaObs$ = this.listEmpresa.asObservable(); // creo una variable obs$y le paso el oservable esto es para que observe si existe algun cambio en la clase a heredar
  constructor(private httpClient: HttpClient, private url: EnviromentService) { }

  // public Search(id: number) {
  //   return this.httpClient.post(this.url.urlAddress + 'Compras/search', + {id}, {headers: this.headers});
  // }
  public SearchProveedor() {
    return this.httpClient.get(this.url.urlAddress + 'Compras/Proveedor', {headers: this.headers});
  }
  public AddCarr(data) {
    return this.httpClient.post(this.url.urlAddress + 'Compras/Addcar', {data}, {headers: this.headers});
  }
  public ListarCarr(idPersona) {
    return this.httpClient.get(this.url.urlAddress + 'Compras/ListarCarr/' + idPersona, {headers: this.headers});
  }
  // creo un metodo para enviar el mensaje
  comunitacioncomponen(message: boolean) {
    this.listEmpresa.next(message);
  }
  public Read() {
    return this.httpClient.get(this.url.urlAddress + 'Almacen/Producto', {headers: this.headers});
  }
  public UpdateCantidad(data) {
    return this.httpClient.patch(this.url.urlAddress + 'Compras/UpdateCantidad', {data}, {headers: this.headers});
  }
  delete(data) {
    return this.httpClient.post(this.url.urlAddress + 'Compras/Delete', {data}, {headers: this.headers});
  }
  // Pagar(Pagos) {
  //   return this.httpClient.post(this.url.urlAddress + 'Compras/Pagar', {Pagos}, {headers: this.headers});
  // }
  LastIdProducto() {
    return this.httpClient.get(this.url.urlAddress + 'Almacen/LastIdProducto', {headers: this.headers});
   }
  ComprasACredito(params) {
    // let params = new HttpParams();
    return this.httpClient.get(this.url.urlAddress + 'Compras/ComprasACredito', { params }).toPromise();
  }
  ObtenerDetalle(id) {
    return this.httpClient.get(this.url.urlAddress + 'Compras/Detalle/' + id, {headers: this.headers}).toPromise();
  }
  PagosCredito(data) {
    return this.httpClient.post(this.url.urlAddress + 'Compras/PagosCredito', {data}, {headers: this.headers}).toPromise();
  }
  verPdf(id) {
    return this.httpClient.get(this.url.urlAddress + 'Compras/VerPdf/' + id, {headers: this.headers}).toPromise();
  }
  verPdf1(data) {
    return this.httpClient.post(this.url.urlAddress + 'Compras/VerPdf' , {data}, {headers: this.headers}).toPromise();
  }

}
