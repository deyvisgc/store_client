import { Component, OnInit } from '@angular/core';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { CompraService } from '../../service/compras/compra.service';
import iziToast from 'izitoast';
import { HttpClient } from '@angular/common/http';
import { EnviromentService } from '../../service/enviroment.service';
import * as JsBarcode from 'jsbarcode';
declare const $: any;
declare const validacion: any;
declare const sendRespuesta: any;
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  data;
  clearstatus = false;
  idCaja = 1;
  listaCarrito: any = [];
  idPersona = 2;
  btnpagar = true;
  labeltypePago = true;
  showpdf = '';
  pdfVisualite = true;
  urlArchivo;
  product = {
    stock               : '0',
    id_product          : 0,
    descripcion         : '',
    image               : '',
    precio_compra       : '',
    pro_name            : '',
    precio_venta        : '',
    pro_cantidad        : 1,
    pro_cantidad_minima : 1,
    pro_status          : '',
    pro_cod_barra       : '',
    id_lote             : 0,
    lote                : ''
  };
  persona = {
    per_razon_social : '',
    per_ruc          : '',
    idProveedor      : ''
  };
  carrito = {
    idPersona       : '',
    idCaja          : 1,
    idProducto      : 0,
    precio_compra   : '',
    pro_cantidad    : 0,
    pro_nombre      : '',
    cantidad_minima : 0,
    codeBarra       : '',
  };
  calculoTotales = {
    total     : '0.00',
    subtotal  : '0.00',
    igv       : '0.00',
    descuento : '0.00'
  };
  pago = {
    monto            : '',
    montoVueltoOrDeuda : '',
    tipo_pago        : '',
    tipo_comprobante : '',
    serie            : '',
    idProveedor      : 0
  };
  constructor(private http: HttpClient, private dynamicScriptLoader: DynamicScriptLoaderService,
              private compraserv: CompraService, private url: EnviromentService) {
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
      $('.cuotas').select2({ width: '100%' });
    });
    $('.tipo_comprobante').select2({ width: '100%' }).on('change', (event) => {
      this.selecrTipoPago(event.target.value);
    });
    $('.cuotas').select2({ width: '100%' });
  }

  showDataProduct(event) {
    const vm = this;
    const stauts = event != null && event.constructor.name === 'Object';
    if (stauts) {
      vm.product.descripcion = event.pro_description;
      vm.product.stock = event.pro_cantidad;
      vm.product.lote = event.lote;
      vm.product.precio_compra = event.pro_precio_compra;
      vm.product.pro_cod_barra = event.pro_cod_barra;
      vm.product.id_product = event.id_product;
      vm.product.pro_name = null;
      console.log(event);
      return false;
    }
    vm.product.pro_name = event;
    vm.product.descripcion = null;
    vm.product.id_product = 0;
    console.log(event);
    return false;

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
      // tslint:disable-next-line:no-string-literal
      const lista = res['lista'];
      if (lista.length > 0) {
        vm.datatable(lista);
        // tslint:disable-next-line:no-string-literal
        vm.calculos(lista[0]['total']);
      } else {
        return false;
      }
    });
  }

  datatable(datos) {
    $('.carritoTable').DataTable({
      "lengthMenu": [[3, 10, 20, 50], [3, 10, 20, 50]],
      data: datos,
      columns: [
        { data: 'pro_name' },
        { data: 'cantidad' ,
        render(data, type, row) {
          return '<input id="cantidad_table"  type="text" class="validate updatecantidad" value=' + row.cantidad + '>';
        },
       },
       { data: 'precio' },
       { data: 'subTotal' },
       { data: () => {
        // tslint:disable-next-line:max-line-length
        return ('<a _ngcontent-nti-c14=""  class="btn btn-tbl-delete delete" style="margin-left: 30px;" ><i _ngcontent-nti-c14="" class="material-icons" style="color:white">delete_forever</i></a>');
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
        $('td:nth-child(3)', row).css('text-align', 'center');
        $('td:nth-child(4)', row).css('text-align', 'center');
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
      vm.carrito.pro_nombre = vm.product.pro_name;
      vm.carrito.cantidad_minima = vm.product.pro_cantidad_minima;
      vm.carrito.codeBarra       = vm.product.pro_cod_barra;
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
    if (vm.product.pro_name === null) {
      if (!vm.product.descripcion) {
        iziToast.error({
          title: 'Error',
          position: 'topRight',
          message: 'Producto requerio',
        });
        return false;
      }
    }
    if (vm.product.descripcion === null) {
      if (!vm.product.pro_name) {
        iziToast.error({
          title: 'Error',
          position: 'topRight',
          message: 'Producto requerio',
        });
        return false;
      }
    }
    if  (vm.product.pro_cantidad === null || vm.product.pro_cantidad === 0) {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'Cantidad requerida',
      });
      return false;
    }
    if  (vm.product.precio_compra === null || vm.product.precio_compra === '') {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'Precio de compra requerido',
      });
      return false;
    }
    if (vm.persona.per_razon_social === null || vm.persona.per_razon_social === '') {
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
    vm.pago.montoVueltoOrDeuda = vueltoFinal.toFixed(2);
  }
  Pagar() {
    const vm = this;
    const form = new FormData();
    const tipoComprobante = document.getElementById('tipo_comprobante')['value'];
    const tipoPago = document.getElementById('tipo_pago')['value'];
    const cuotas = document.getElementById('cuotas')['value'];
    form.append('subtotal', vm.calculoTotales.subtotal);
    form.append('total', vm.calculoTotales.total);
    form.append('igv', vm.calculoTotales.igv);
    form.append('cuotas', cuotas);
    form.append('monto', vm.pago.monto);
    form.append('montoVueltoOrDeuda', vm.pago.montoVueltoOrDeuda);
    form.append('tipoComprobante', tipoComprobante);
    form.append('tipoPago', tipoPago);
    form.append('idProveedor', vm.idPersona.toString());
    form.append('pdf', vm.urlArchivo);
    const statusValidacion = validacion(vm.calculoTotales.total, vm.pago.monto, tipoPago, tipoComprobante);
    if (statusValidacion['status'] === false) {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: statusValidacion['message'],
      });
      return false;
    }
    vm.http.post(vm.url.urlAddress + 'Compras/Pagar', form).subscribe(res => {
      if (res['status']) {
        iziToast.success({
          title: 'OK',
          position: 'topRight',
          message: res['message'],
        });
        $('#modalPagar').modal('hide');
        vm.compraserv.comunitacioncomponen(true);
        vm.LimpiarPagos();

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
  SeleccionarFile(event) {
    const vm = this;
    vm.urlArchivo = event.target.files[0];
    // tslint:disable-next-line:one-variable-per-declaration
    vm.showpdf = (event.target.files[0].name).substring(0, 20);
    vm.pdfVisualite = false;
  }
  verArchivo() {
    const vm = this;
    const url = URL.createObjectURL(vm.urlArchivo);
    window.open(url);
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
    $('#barcode').html('');
  }
  LimpiarPagos() {
    const vm = this;
    $('#tipo_pago').val('debito');
    $('#tipo_comprobante').val('');
    vm.pago.idProveedor = 0;
    vm.pago.monto = '';
    vm.pago.montoVueltoOrDeuda = '';
    vm.datatable([]);
    vm.calculos(0);
    vm.showpdf = '';
    vm.pdfVisualite = true;
  }
  GenerarCodeBarra() {
    const vm = this;
    vm.compraserv.LastIdProducto().subscribe(res => {
      const respta = sendRespuesta(res);
      if (respta.status && respta.codigo === 200) {
        vm.product.pro_cod_barra = respta.data;
        JsBarcode('#barcode', respta.data, {
          format: 'CODE128',
          height: 50
        });
      }
    });
  }

  // SeleccionarFile(event) {
  //   const vm = this;
  //   // Creamos el objeto de la clase FileReader
  //   const reader = new FileReader();

  //     // Leemos el archivo subido y se lo pasamos a nuestro fileReader
  //   reader.readAsDataURL(event.target.files[0]);

  //   // Le decimos que cuando este listo ejecute el código interno
  //   reader.onload = () => {
  //     const preview = document.getElementById('preview');
  //     const image = document.createElement('img');
  //     image.src = reader.result as string;
  //     image.style.width = '100px';
  //     preview.innerHTML = '';
  //     preview.append(image);
  //   };
  //   vm.img = false;
  // }
}
