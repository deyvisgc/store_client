import { Component, OnInit } from '@angular/core';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { CompraService } from '../../service/compras/compra.service';
declare const $: any;
declare const validacion: any;
import iziToast from 'izitoast';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  clearstatus = false;
  idCaja = 1;
  listaCarrito: any = [];
  idPersona = 2;
  btnpagar = true;
  labeltypePago = true;
  config = {
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: this.listaCarrito.count
  };
  product = {
    stock : '0',
    id_product : 0,
    descripcion: '',
    image: '',
    precio_compra : '',
    pro_name: '',
    precio_venta : '',
    pro_cantidad : 1,
    pro_cantidad_minima: 1,
    pro_status : '',
    pro_cod_barra : '',
    id_lote : 0,
    lote : ''
  };
  persona = {
    per_razon_social : '',
    per_ruc : '',
    idProveedor : ''
  };
  carrito = {
    idPersona : '',
    idCaja: 1,
    idProducto : 0,
    precio_compra : '',
    pro_cantidad : 0,
  };
  calculoTotales = {
    total: '0.00',
    subtotal: '0.00',
    igv : '0.00',
    descuento : '0.00'
  };
  pago = {
    monto : '',
    vuelto : '',
    tipo_pago : '',
    tipo_comprobante : '',
    serie : '',
    idProveedor : 0
  };
  constructor(private dynamicScriptLoader: DynamicScriptLoaderService, private compraserv: CompraService) {
  }
  pageChanged(event){
    this.config.currentPage = event;
  }
  ngOnInit() {
    this.startScript();
  }
  async startScript() {
    await this.dynamicScriptLoader.load('form.min').then(data => {
      this.loadData();
    }).catch(error => console.log(error));
  }
  private loadData() {
    const vm = this;
    vm.ListarCar();
    $('.tipo_pago').select2({ width: '100%' }).on('change', (event) => {
      this.selecrTipoPago(event.target.value);
    });
    $('.tipo_comprobante').select2({ width: '100%' }).on('change', (event) => {
      this.selecrTipoPago(event.target.value);
    });
  }
  showDataProduct(event) {
    const vm = this;
    vm.product.descripcion = event.pro_description;
    vm.product.stock = event.pro_cantidad;
    vm.product.lote = event.lote;
    vm.product.precio_compra = event.pro_precio_compra;
    vm.product.pro_cod_barra = event.pro_cod_barra;
    vm.product.pro_name = event.pro_name;
    vm.product.id_product = event.id_product;
  }
  showDaProveedor(event) {
    const vm = this;
    vm.persona.per_ruc = event.per_ruc;
    vm.persona.per_razon_social = event.per_razon_social;
    vm.persona.idProveedor = event.id_persona;
  }
  ListarCar() {
    const vm = this;
    vm.compraserv.ListarCarr(vm.idPersona).subscribe((res: any = []) => {
      const lista = res['lista'];
      if (lista.length > 0) {
        // vm.listaCarrito = lista;
        vm.datatable(lista);
        vm.calculos(lista[0]['total']);
      } else {
        return false;
      }
    });
  }
  datatable(datos) {
    $('.carritoTable').DataTable({
      "lengthMenu": [[5, 50, 'All'], [5, 50, 'All']],
      data: datos,
      columns: [
        { data: 'pro_name' },
        { data: 'cantidad' ,
        render(data, type, row) {
          // tslint:disable-next-line:semicolon
          // tslint:disable-next-line:max-line-length
          return '<input id="cantidad_table"  type="text" class="validate updatecantidad" value=' + row.cantidad + '>';
        },
       },
       { data: 'precio' },
       { data: 'subTotal' },
       { data: () => {
        // tslint:disable-next-line:max-line-length
        return ('<button _ngcontent-vfy-c6=" style="margin-left: 5px;font-size: 20px;" class="btn bg-pink waves-effect delete" type="button"><i style="padding-bottom:20px class="fas fa-trash-alt"></i></button>');
      }
      },
      ],
      responsive: true,
      rowCallback: ( row, data ) => {
        const vm = this;
        $('.delete', row).bind('click', () => {
          vm.delete(data);
        });
        $('.updatecantidad', row).bind('keyup.enter' , (e) => {
            vm.UpdateCantidad(data, e);
        });
      },
      language: {
        decimal: '',
        emptyTable: 'No exsiten Compras',
        info: 'Mostrando _START_ a _END_ de _TOTAL_ Compras',
        infoEmpty: 'Mostrando 0 to 0 of 0 Entradas',
        infoFiltered: '(Filtrado de _MAX_ total Compras)',
        infoPostFix: "",
        thousands: ",",
        lengthMenu: 'Mostrar _MENU_ Compras',
        loadingRecords: 'Cargando...',
        processing: 'Procesando...',
        search: 'Buscar:',
        zeroRecords: 'Sin resultados encontrados',
        paginate: {
          first: 'Primero',
          last: 'Ultimo',
          next: 'Siguiente',
          previous: 'Anterior'
        }
      },
      order: [],
      destroy: true
    });
  }
  AddCart() {
    const vm = this;
    const status = vm.validarCarr();
    if (status === true) {
      vm.carrito.idProducto = vm.product.id_product;
      vm.carrito.idPersona = vm.persona.idProveedor;
      vm.carrito.idCaja = vm.idCaja;
      vm.carrito.precio_compra = vm.product.precio_compra;
      vm.carrito.pro_cantidad = vm.product.pro_cantidad;
      vm.compraserv.AddCarr(vm.carrito).subscribe(res => {
        vm.datatable(res);
        vm.calculos(res[0]['total']);
        vm.Linpiar();
      });
    }
  }
  calculos(total) {
    const vm = this;
    let subTotal = '';
    let igv = '';
    let total1 = '';
    total1 = parseFloat(total).toFixed(2);
    subTotal = (parseFloat(total)  / 1.18).toFixed(2);
    igv = (parseFloat(subTotal) * 0.18).toFixed(2);
    vm.calculoTotales.subtotal = subTotal;
    vm.calculoTotales.igv = igv;
    vm.calculoTotales.total = total1;
    vm.btnpagar = false;
  }
  validarCarr() {
    const vm = this;
    if (vm.product.pro_name === null || vm.product.pro_name === '') {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'Producto requerio',
      });
      return false;
    } else if  (vm.product.pro_cantidad === null || vm.product.pro_cantidad === 0) {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'Cantidad requerida',
      });
      return false;
    } else if  (vm.product.precio_compra === null || vm.product.precio_compra === '') {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'Precio de compra requerido',
      });
      return false;
    } else if (vm.persona.per_razon_social === null || vm.persona.per_razon_social === '') {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'Razon social Requerido',
      });
      return false;
    } else {
      return true;
    }
  }
  Linpiar() {
    const vm = this;
    vm.product.descripcion = '';
    vm.product.pro_cantidad = 1;
    vm.product.pro_cantidad_minima = 1;
    vm.product.stock = '0';
    vm.product.lote = '';
    vm.product.precio_compra = '';
    vm.product.pro_cod_barra = '';
    vm.product.pro_name = '';
    vm.persona.per_razon_social = '';
    vm.persona.per_ruc = '';
    vm.clearstatus = true;
    this.compraserv.comunitacioncomponen(true);
  }
  UpdateCantidad(item, event) {
    if (event.key === 'Enter') {
      const vm = this;
      const parameters = {
        id: item.id,
        idPersona: item.idPersona,
        value : event.target.value,
        precio : item.precio
      };
      vm.compraserv.UpdateCantidad(parameters).subscribe(res => {
        const lista = res['lista'];
        if (!res['status']) {
          iziToast.error({
            title: 'Error',
            position: 'topRight',
            message: res['message'],
          });
          return false;
        }
        vm.datatable(lista);
        vm.calculos(lista[0]['total']);
      });
  }
  }
  delete(item) {
    const vm = this;
    const parameters = {
      id: item.id,
      idPersona: item.idPersona,
    };
    vm.compraserv.delete(parameters).subscribe((res: any = []) => {
      const zise = res['lista'].length;
      const lista = res['lista'];
      if (!res['status']) {
        iziToast.error({
          title: 'Error',
          position: 'topRight',
          message: res['message'],
        });
        return false;
      }
      if (zise === 0) {
        vm.datatable([]);
        vm.calculos(0);
        return false;
      }
      vm.datatable(lista);
      vm.calculos(lista[0]['total']);
    });
  }
  CalcularVuelto(event) {
    const vm = this;
    const vuelto = parseFloat(vm.calculoTotales.total) - parseFloat(event.target.value);
    const vueltoFinal = Math.abs(vuelto);
    vm.pago.vuelto = vueltoFinal.toFixed(2);
  }
  Pagar() {
    const vm = this;
    vm.pago.tipo_pago = document.getElementById('tipo_pago')['value'];
    vm.pago.tipo_comprobante = document.getElementById('tipo_comprobante')['value']
    vm.pago.idProveedor = vm.idPersona;
    const statusValidacion = validacion(vm.calculoTotales.total, vm.pago.monto, vm.pago.tipo_pago, vm.pago.tipo_comprobante);
    if (statusValidacion['status'] === false) {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: statusValidacion['message'],
      });
      return false;
    }
    vm.compraserv.Pagar(vm.pago, vm.calculoTotales).subscribe(res => {
      if (res['status']) {
        iziToast.success({
          title: 'OK',
          position: 'topRight',
          message: res['message'],
        });
        $('#modalPagar').modal('hide');
        vm.datatable([]);
        vm.calculos(0);
      } else {
        iziToast.error({
          title: 'Error',
          position: 'topRight',
          message: statusValidacion['message'],
        });
        $('#modalPagar').modal('hide');
        return false;
      }
    });
  }
  selecrTipoPago(value) {
    const vm = this;
    if (value === 'credito') { vm.labeltypePago = true; }
    if (value === 'debito') { vm.labeltypePago = false; }
  }
}
