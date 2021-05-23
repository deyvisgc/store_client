import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoteService } from '../../service/Almacen/lote/lote.service';
declare const sendRespuesta: any;
@Component({
  selector: 'app-c-seleccionar-lote',
  templateUrl: './c-seleccionar-lote.component.html',
  styleUrls: ['./c-seleccionar-lote.component.css']
})
export class CSeleccionarLoteComponent implements OnInit {
  constructor(private loteSer: LoteService) { }
  @Output() lote = new EventEmitter<any>();
  @Input() isActiveLote: boolean;
  listLotes = [];
  params = {
    numeroRecnum: 0,
    noMore: false,
    cantidadRegistros: 10
  };
  isScroll: boolean;
  isloadinglista: boolean;
  modalScrollDistance = 2;
  modalScrollThrottle = 50;
  infiniteScrollStatus: boolean;

  ngOnInit() {
    this.fetch();
  }
  onScrollDown() {
    this.isScroll = true;
    this.fetch();
  }
  fetch() {
    const vm = this;
    vm.isloadinglista = true;
    vm.infiniteScrollStatus = true;
    if (!vm.isScroll) {
      vm.listLotes = [];
      vm.params.numeroRecnum = 0;
    }
    vm.loteSer.getLote(vm.params).then(res => {
      const rpta = sendRespuesta(res);
      // tslint:disable-next-line:prefer-for-of
      for (let index = 0; index < rpta.data.lista.length; index++) {
        vm.listLotes.push(rpta.data.lista[index]);
      }
      if (!rpta.data.noMore) {
        vm.params.numeroRecnum  = rpta.data.numeroRecnum;
        vm.infiniteScrollStatus = false;
      } else {
        vm.infiniteScrollStatus = true;
      }
    }).catch(() => {
      vm.isScroll = false;
    }).finally(() => {
      vm.isloadinglista = false;
    });
  }
  seleccionarClick(e) {
    const vm = this;
    vm.lote.emit(e);
  }
  searchLote(search) {
    const vm = this;
    const params = search.target.value.length;
    if ( params >= 3) {
      vm.loteSer.SearchLote(search.target.value).then( res => {
        const rpta = sendRespuesta(res);
        const cantidad =  rpta.data.length;
        if (rpta.status && cantidad > 0) {
          vm.listLotes = rpta.data;
        } else {
          vm.listLotes = [];
          vm.isloadinglista = false;
        }
      }).catch((err) => {
        console.log('Error', err);
      }).finally(() => {
        console.log('finaly');
      });
    }
    if (params === 0) {
      this.fetch();
      vm.listLotes = [];
  }
  }
}
