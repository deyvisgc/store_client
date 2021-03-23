import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { CompraService } from '../../service/compras/compra.service';
declare const $: any;
@Component({
  selector: 'app-provedorselect',
  templateUrl: './provedorselect.component.html',
  styleUrls: ['./provedorselect.component.css']
})
export class ProvedorselectComponent implements OnInit {
  @ViewChild('auto', {static: true}) auto;
  keyword = 'per_razon_social';
  selectproveedor: any = [];
  @Output() public proveedorselect = new EventEmitter <any>();
  constructor(private compraserv: CompraService) { }
  ngOnInit() {
    this.loadData();
    this.clear();
  }
  selectEvent(item) {
    this.proveedorselect.emit(item);
  }
  onChangeSearch(val: string) {
    console.log(val);
  }
  onFocused(e) {
    this.auto.clear();
  }
  private loadData() {
    const vm = this;
    vm.compraserv.SearchProveedor().subscribe((res: any = []) => {
      vm.selectproveedor = res;
    });
  }
  clear() {
    this.compraserv.listEmpresaObs$.subscribe(data => {
      if (data === true) {
        this.selectproveedor = [];
        this.loadData();
        this.auto.clear();
        this.auto.close();
      }
     });
  }
}
