import { Component, OnInit } from '@angular/core';
declare const sendRespuesta: any;
import iziToast from 'izitoast';
import * as moment from 'moment';
import { ProductoService } from '../../service/Almacen/producto/producto.service';
declare const $: any;
@Component({
  selector: 'app-actualizar-stock',
  templateUrl: './actualizar-stock.component.html',
  styleUrls: ['./actualizar-stock.component.css']
})
export class ActualizarStockComponent implements OnInit {
  product = {
    pro_nombre: '',
    pro_cantdad: 1,
    id_product_unidades: 0,
    fecha_vencimiento: moment().format('YYYY-MM-DD'),
    lote: []
  };
  activeProductoxLote = false;
  activeProductoxUnidad = false;
  typeProducto = '';
  showBox = true;
  rptatotal = 0;
  fechahoy = moment().format('DD-MM-YYYY');
  fechaexpiracion = moment().add(1, 'months').format('YYYY-MM-DD');
  indexSeleccionado = '';
  isActiveLote = false;
  listError = [];
  loading = false;
  typeAjustar = false;
  constructor(private producSer: ProductoService) { }

  ngOnInit() {
    window.addEventListener('keyup', e => {
      const vm = this;
      if (e.keyCode === 27) {
        vm.activeProductoxLote = false;
        vm.activeProductoxUnidad = false;
        vm.isActiveLote = false;
      }
    });
  }
  TabLotes() {
    const vm = this;
    vm.typeAjustar = true;
  }
  TabUnidad() {
    const vm = this;
    vm.typeAjustar = false;
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
    vm.activeProductoxLote = true;
    vm.typeProducto = 'lote';
    vm.isActiveLote = false;
  }
  showSelectProductoxUnidad() {
    const vm = this;
    vm.activeProductoxUnidad = true;
    vm.typeProducto = 'unidad';
  }
  showSelectLote(i) {
    const vm = this;
    vm.indexSeleccionado = i;
    vm.isActiveLote = true;
    vm.activeProductoxLote = false;
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
    vm.activeProductoxLote = false;
  }
  selectProductoxUnidad(producto) {
    const vm = this;
    vm.product.pro_nombre = producto.pro_name;
    vm.product.id_product_unidades = producto.id_product_unidades;
    vm.product.pro_cantdad = producto.cantidad;
    vm.product.fecha_vencimiento = moment(producto.fecha_vencimiento).format('YYYY-MM-DD');
    console.log(vm.product);
    vm.activeProductoxUnidad = false;
  }
  selectLote(lote) {
    const vm = this;
    vm.product.lote[vm.indexSeleccionado].codigo_lote = lote.lot_code;
    vm.product.lote[vm.indexSeleccionado].cantidad = lote.lot_cantidad;
    vm.product.lote[vm.indexSeleccionado].lot_expiration_date = lote.lot_expiration_date;
    vm.product.lote[vm.indexSeleccionado].id_lote = lote.id_lote;
    vm.isActiveLote = false;
  }
  Ajustar() {
    const vm = this;
    if (vm.typeAjustar) {
      if (vm.product.lote.length === 0) {
        iziToast.error({
          title: 'Error',
          position: 'topRight',
          message: 'debe agregar como minimo un item para ajustar stock',
        });
        return;
      }
    } else {
      if (!vm.product.pro_nombre) {
        iziToast.error({
          title: 'Error',
          position: 'topRight',
          message: 'Producto requerido',
        });
        return;
      }
      if (vm.product.pro_cantdad === 0) {
        iziToast.error({
          title: 'Error',
          position: 'topRight',
          message: 'El stock ajustar debe ser mayor a 0',
        });
        return;
      }
    }
    vm.loading = true;
    vm.producSer.AjustarStock(vm.product).then(res => {
      const rpta = sendRespuesta(res);
      console.log('sss', rpta.data.error);
      if (rpta.data.error.length > 0) {
        vm.listError = rpta.data.error;
        $('#modal-errores').modal('show');
        return;
      }
      iziToast.success({
        title: 'Exito',
        position: 'topRight',
        message: rpta.message,
      });
      vm.limpiarObjeto();
    }).catch((err) => {
      console.log('Error', err);
    }).finally(() => {
      console.log('finaly');
      vm.loading = false;
    });
  }
  close() {
    const vm = this;
    vm.listError = [];
    $('#modal-errores').modal('hide');
  }
  limpiarObjeto() {
    const vm = this;
    vm.product.fecha_vencimiento = moment().format('YYYY-MM-DD');
    vm.product.id_product_unidades = 0;
    vm.product.pro_nombre = '';
    vm.product.pro_cantdad = 1;
    vm.product.lote = [];
  }
}
