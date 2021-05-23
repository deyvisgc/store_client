import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UnidadMedidaService } from '../../service/Almacen/unidad-medida/unidad-medida.service';
declare const sendRespuesta: any;
@Component({
  selector: 'app-c-seleccionar-unidad-medida',
  templateUrl: './c-seleccionar-unidad-medida.component.html',
  styleUrls: ['./c-seleccionar-unidad-medida.component.css']
})
export class CSeleccionarUnidadMedidaComponent implements OnInit {

  constructor(private unidadSer: UnidadMedidaService) { }
  @Output() unidadMedida = new EventEmitter<any>();
  @Input() isActiveUnidadMedida: boolean;
  listUnidadMedida = [];
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
      vm.listUnidadMedida = [];
      vm.params.numeroRecnum = 0;
    }
    vm.unidadSer.GetUnidadMedida(vm.params).then(res => {
      const rpta = sendRespuesta(res);
      // tslint:disable-next-line:prefer-for-of
      for (let index = 0; index < rpta.data.lista.length; index++) {
        vm.listUnidadMedida.push(rpta.data.lista[index]);
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
    vm.unidadMedida.emit(e);
  }
  searchUnidadMedida(search) {
    const vm = this;
    const params = search.target.value.length;
    if ( params >= 3) {
      vm.unidadSer.SearchUnidadMedida(search.target.value).then( res => {
        const rpta = sendRespuesta(res);
        const cantidad =  rpta.data.length;
        if (rpta.status && cantidad > 0) {
          vm.listUnidadMedida = rpta.data;
        } else {
          vm.listUnidadMedida = [];
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
      vm.listUnidadMedida = [];
  }
  }

}
