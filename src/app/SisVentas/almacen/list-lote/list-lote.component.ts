import { Component, OnInit } from '@angular/core';
declare const sendRespuesta: any;
import iziToast from 'izitoast';
import * as moment from 'moment';
@Component({
  selector: 'app-list-lote',
  templateUrl: './list-lote.component.html',
  styleUrls: ['./list-lote.component.css']
})
export class ListLoteComponent implements OnInit {
  product = {
    pro_nombre: '',
    lote: []
  };
  isloadingProducto = false;
  showBox = true;
  rptatotal = 0;
  fechahoy = moment().format('DD-MM-YYYY');
  fechaexpiracion = moment().add(1, 'months').format('YYYY-MM-DD');
  indexSeleccionado = '';
  isActiveLote = false;
  constructor() { }

  ngOnInit() {
    window.addEventListener('keyup', e => {
      const vm = this;
      if (e.keyCode === 27) {
        vm.isloadingProducto = false;
        vm.isActiveLote = false;
      }
    });
  }
  AgregarLotes() {
    const vm = this;
    const objLote = {
      pro_nombre: '',
      id_producto: '',
      cantidad: 1,
      lot_expiration_date: vm.fechaexpiracion,
      id_lote: 0,
      codigo_lote: ''
    };
    vm.product.lote.push(objLote);
  }
  showSelectProducto(i) {
    const vm = this;
    vm.indexSeleccionado = i;
    vm.isloadingProducto = true;
    vm.isActiveLote = false;
  }
  showSelectLote(i) {
    const vm = this;
    vm.indexSeleccionado = i;
    vm.isActiveLote = true;
    vm.isloadingProducto = false;
  }
  eliminar(index) {
    const vm = this;
    vm.product.lote.splice(index, 1);
  }
  selectProducto(producto) {
    const vm = this;
    vm.product.lote[vm.indexSeleccionado].pro_nombre = producto.pro_name;
    vm.product.lote[vm.indexSeleccionado].id_producto = producto.id_product;
    vm.showSelectLote(vm.indexSeleccionado);
    vm.isloadingProducto = false;
  }
  selectLote(lote) {
    const vm = this;
    vm.product.lote[vm.indexSeleccionado].codigo_lote = lote.lot_code;
    vm.product.lote[vm.indexSeleccionado].cantidad = lote.lot_cantidad;
    vm.product.lote[vm.indexSeleccionado].lot_expiration_date = lote.lot_expiration_date;
    vm.product.lote[vm.indexSeleccionado].id_lote = lote.id_lote;
    vm.isActiveLote = false;
  }
}
