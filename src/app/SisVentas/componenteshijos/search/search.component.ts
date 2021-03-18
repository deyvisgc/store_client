import { Component, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { AlmacenService } from '../../service/Almacen/almacen.service';
declare const $: any;
import iziToast from 'izitoast';
import { ProductoComponent } from '../../almacen/producto/producto.component';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.sass']
})
export class SearchComponent implements OnInit {
  // @ViewChild(ProductoComponent, { static: false }) product: ProductoComponent;
  @Output() public searchtselect = new EventEmitter <any>();
  lote1: any = [];
  clase1: any = [];
  unidad1: any = [];
  constructor(private dynamicScriptLoader: DynamicScriptLoaderService, private almacenServ: AlmacenService) { }

  ngOnInit() {
    this.startScript();
  }
  private loadData() {
    this.select();
    // this.desactiviarOrDesactivar(1);
    $('#loteseach').select2().on('change', (event) => {
       this.searchxType(event.target.value, 'lote');
    });
    $('#claseseach').select2().on('change', (event) => {
      this.searchxType(event.target.value, 'clase');
   });
    $('#unidadseacrh').select2().on('change', (event) => {
    this.searchxType(event.target.value, 'unidad');
    });
        // this.select2();
  }
  async startScript() {
    await this.dynamicScriptLoader.load('form.min').then(data => {
      this.loadData();
    }).catch(error => console.log(error));
  }
   searchxType(event, searctype) {
    const data = [{
      typesearch : searctype,
      id : event
    }];
    // this.loading = true;
    this.almacenServ.SearchxType(data).subscribe((resp: any = []) => {
     if (resp.length > 0) {
      //  this.loading = false;
       iziToast.success({
         title: 'Succes',
         position: 'topRight',
         message: 'productos encontrados',
       });
       this.searchtselect.emit(resp);
     } else {
      //  this.loading = false;
       iziToast.error({
         title: 'Error',
         message: 'productos no encontrados',
        });
       this.searchtselect.emit(resp);
     }
    });
  }
  public select() {
    this.almacenServ.Lote().subscribe(res => {
      this.lote1 = res;
      console.log(this.lote1);
    });
    this.almacenServ.UnidadMedida().subscribe(resp => { 
      this.unidad1 = resp;
      console.log(this.unidad1);
    });
    this.almacenServ.getClaseSupe().subscribe(respcla => {
      this.clase1 = respcla;
      console.log(this.clase1);
    });
 }
 select2() {
  $('.select').select2({ width: '100%' });
 }
 Listar() {
   this.almacenServ.Read().subscribe((resp: any = []) => {
     this.searchtselect.emit(resp);
   });
 }
}
