import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { EnviromentService } from '../enviroment.service';
import { Compra } from './compras.interface';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  _headers = new HttpHeaders();
  headers = this._headers.append('Content-Type', 'application/json');
  private listEmpresa = new Subject<boolean>(); //para limpiar el autocomplete de la compra
  private Compra = new Subject<Compra[]>(); // Obtener el listado de todas las listas
  private showActive = new Subject<number>();
  private exporpdf = new Subject<number>();
  // tslint:disable-next-line:max-line-length
  listEmpresaObs$ = this.listEmpresa.asObservable(); // creo una variable obs$y le paso el oservable esto es para que observe si existe algun cambio en la clase a heredar
  Compra$ = this.Compra.asObservable();
  showActive$ = this.showActive.asObservable();
  exporpdf$ = this.exporpdf.asObservable();

  constructor(private httpClient: HttpClient, private url: EnviromentService) { }

    // borrar el autocoplete de compras
    comunitacioncomponen(message: boolean) {
    this.listEmpresa.next(message);
    }
    // listar la lista en los reportes compras vegentes, anuladas ,credito y contado
    SendListasCompras(lista: Compra[]) {
      this.Compra.next(lista);
    }
    //Activa o desacitivar el tab
    ShowActiveTab(message: number) {
      this.showActive.next(message);
    }
    ExportarPdf(message: number) {
      this.exporpdf.next(message);
    }

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
  PagosCredito(data) {
    return this.httpClient.post(this.url.urlAddress + 'Compras/PagosCredito', {data}, {headers: this.headers}).toPromise();
  }
  Compras(params) {
   return this.httpClient.get(this.url.urlAddress + 'Compras/All', {params, headers: this.headers}).toPromise();
  }
  ObtenerDetalle(id) {
    return this.httpClient.get(this.url.urlAddress + 'Compras/Detalle/' + id, {headers: this.headers}).toPromise();
  }
  ChangeStatus(id) {
    return this.httpClient.patch(this.url.urlAddress + 'Compras/ChangeStatus/' + id, {headers: this.headers}).toPromise();
  }
  DowloadExcel(params): Observable<any> {
    // tslint:disable-next-line:no-unused-expression
    return this.httpClient.get(this.url.urlAddress + 'Compras/Exportar/', {params, responseType: 'blob'});
  }
  DowloadExcelBuyId(id): Observable<any> {
    // tslint:disable-next-line:no-unused-expression
    return this.httpClient.get(this.url.urlAddress + 'Compras/Exportar/' + id, {responseType: 'blob'});
  }

}
