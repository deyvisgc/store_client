import { Component, OnInit, Output, EventEmitter, ViewChild, Input} from '@angular/core';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { AlmacenService } from '../../service/Almacen/almacen.service';
import { CompraService } from '../../service/compras/compra.service';
declare const $: any;
@Component({
  selector: 'app-selectproducto',
  templateUrl: './selectproducto.component.html',
  styleUrls: ['./selectproducto.component.css']
})
export class SelectproductoComponent implements OnInit {
  focus;
  @ViewChild('auto', {static: true}) auto;
  @Input() clearstatus: boolean;
  keyword = 'pro_name';
  selectproducto = [];
  @Output() public productselect = new EventEmitter <any>();
  constructor(private comprasSer: CompraService) { }
  ngOnInit() {
    this.loadData();
    this.clear1();
  }
 private loadData() {
  this.comprasSer.Read().subscribe((res: any = []) => {
     this.selectproducto = res;
  });
 }
 selectEvent(item) {
   this.productselect.emit(item);
  }
  onChangeSearch(val: string) {
    this.productselect.emit(val);
  }
  onFocused(e) {
    console.log(e);
    this.focus = this.auto.clear();
  }
  onCleared(event) {
    if (this.focus === 'undefined') {
      return false;
    }
    if (this.focus === '') {
      console.log(this.focus);
      this.productselect.emit(event);
    }
  }
  clear1() {
    this.comprasSer.listEmpresaObs$.subscribe(data => {
      if (data === true) {
        this.selectproducto = [];
        this.loadData();
        this.auto.clear();
        this.auto.close();
      }
     });
  }
}
