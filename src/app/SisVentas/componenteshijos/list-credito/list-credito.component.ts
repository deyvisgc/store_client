import { Component, OnInit  } from '@angular/core';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { CompraService } from '../../service/compras/compra.service';
import iziToast from 'izitoast';
declare const $: any;
declare const sendRespuesta: any;
declare const calcularVuelto: any;
@Component({
  selector: 'app-list-credito',
  templateUrl: './list-credito.component.html',
  styleUrls: ['./list-credito.component.css']
})
export class ListCreditoComponent implements OnInit {
  constructor(private dynamicScriptLoader: DynamicScriptLoaderService, private compraserv: CompraService) { }
  mensaje;
  labelVueltoOrDeuda = false;
  inputllenos = false;
  table;
  detalleCompraDeuda: any = [];
  detalleCompraPagada: any = [];
  credito = {
    deuda: '',
    monto: '',
    vuelto: '',
    idVendedor: localStorage.getItem('vendedor'),
    idCompra : 0,
    idVenta: 0,
    deudaporPagar : ''
  };
  params = {
    numeroCompra   : '',
    fechaDesde     : '',
    fechaHasta     :  '',
    codeProveedor  : '',
    tipoPago       : '',
    tipoComprobante: '',
    tabla        : 'credito'
  };
  ngOnInit() {
    this.startScript();
    localStorage.setItem('vendedor', '2');
  }
  async startScript() {
    await this.dynamicScriptLoader.load('form.min').then(data => {
    }).catch(error => console.log(error));
  }
  Listar(params) {
    const vm = this;
    vm.compraserv.ComprasACredito(params).then(res => {
      const rpta = sendRespuesta(res);
      if (rpta.data.length > 0) {
        const Deudas = rpta.data.filter(f => f.comEstado === '1');
        const Pagadas = rpta.data.filter( f => f.comEstado === '2');
        vm.datatableDeudas('.tableCredito_deudas', Deudas);
        vm.datatablePagadas('.tableCredito_pagadas', Pagadas);
      } else {
        vm.datatableDeudas('.tableCredito_deudas', []);
        vm.datatablePagadas('.tableCredito_pagadas', []);
      }
    });
  }
  datatableDeudas(url, datos) {
    const vm = this;
    vm.table = $(url).DataTable({
      "lengthMenu": [[10, 20, 50], [10, 20, 50]],
      data: datos,
      columns: [
       { data: 'idCompra'},
       { data: 'razonSocial',
       render( data, type, row ) {
        return row.razonSocial + '-' + row.ruc;
      },
       },
       { data: 'comFecha' },
       { data: 'comEstado',
       render(data, type, row) {
         if (row.comEstado  === '1') {
          return '<span _ngcontent-nly-c9="" class="label bg-red shadow-style">Debe</span>';
         } else if (row.comEstado  === '2') {
          return '<span _ngcontent-nly-c9="" class="label bg-green shadow-style">Pagado</span>';
         }
       },
      },
      {data: 'comMontoPagado'},
      {data: 'comMontoDeuda'},
      {data: 'comTotal'},
      { data: (data) => {
        if (data.comEstado === '1') {
          // tslint:disable-next-line:max-line-length
          return (`<button _ngcontent-njl-c5="" class="btn bg-teal btn-circle waves-effect waves-circle waves-float pagarCredito" type="button"><i _ngcontent-mqk-c6="" style="color:white" class="fab fa-cc-visa"></i></button> <button style="margin-left:5px" _ngcontent-qan-c5="" class="btn btn-danger btn-circle waves-effect waves-circle waves-float verComprobante" type="button"><i _ngcontent-mqs-c7="" class="fas fa-file-pdf"></i></button>`);
        } else {
          // tslint:disable-next-line:max-line-length
          return (`<button style="margin-left:5px" _ngcontent-qan-c5="" class="btn btn-danger btn-circle waves-effect waves-circle waves-float verComprobante" type="button"><i _ngcontent-mqs-c7="" class="fas fa-file-pdf"></i></button>`);
        }
      }
      },
      ],
      responsive: true,
      rowCallback: ( row, data ) => {
        $('.pagarCredito', row).bind('click', () => {
          vm.credito.deuda = data.comMontoDeuda;
          vm.credito.idCompra = data.idCompra;
          console.log(vm.credito);
          $('#modalPagarCredito').modal('show');
        });
        $('.verComprobante', row).bind('click' , (e) => {
          vm.verComprobante(data);
        });
        $('td', row).css('cursor', 'pointer');
        // $('td', row).hover(function(){
        //   $(this).css('background-color', '#ABA8A9');
        //   }, function() {
        //   $(this).css('background-color', 'white');
        // });
      },
      language: {
        decimal: '',
        emptyTable: 'No exsiten Compras',
        info: 'Mostrando _START_ a _END_ de _TOTAL_ Compras',
        infoEmpty: 'Mostrando 0 to 0 of 0 Entradas',
        infoFiltered: '(Filtrado de _MAX_ total Compras)',
        infoPostFix: '',
        thousands: ',',
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
    // const tabladetalle = url.concat(' ').concat('tbody');
    $('.tableCredito_deudas tbody').on('dblclick', 'tr', function() {
      const data = vm.table.row( this ).data();
      console.log(vm.table);
      vm.compraserv.ObtenerDetalle(data.idCompra).then(res => {
        const rpta = sendRespuesta(res);
        vm.detalleCompraDeuda = rpta.data;
      });
  } );
  }
  datatablePagadas(url, datos) {
    const vm = this;
    const table = $(url).DataTable({
      "lengthMenu": [[3, 10, 20, 50], [3, 10, 20, 50]],
      data: datos,
      columns: [
       { data: 'idCompra'},
       { data: 'razonSocial',
       render( data, type, row ) {
        return row.razonSocial + '-' + row.ruc;
      },
       },
       { data: 'comFecha' },
       { data: 'comEstado',
       render(data, type, row) {
         return '<span _ngcontent-nly-c9="" class="label bg-green shadow-style">Pagado</span>';
       },
      },
      {data: 'comMontoPagado'},
      {data: 'comMontoDeuda'},
      {data: 'comTotal'},
      { data: () => {
        // tslint:disable-next-line:max-line-length
        return (`<button style="margin-left:5px" _ngcontent-qan-c5="" class="btn btn-danger btn-circle waves-effect waves-circle waves-float verComprobante" type="button"><i _ngcontent-mqs-c7="" class="fas fa-file-pdf"></i></button>`);
      }
      },
      ],
      responsive: true,
      rowCallback: ( row, data ) => {
        $('.verComprobante', row).bind('click' , () => {
          vm.verComprobante(data);
        });
        $('td', row).css('cursor', 'pointer');
        // $('td', row).hover(function(){
        //   $(this).css('background-color', '#ABA8A9');
        //   }, function() {
        //   $(this).css('background-color', 'white');
        // });
      },
      language: {
        decimal: '',
        emptyTable: 'No exsiten Compras',
        info: 'Mostrando _START_ a _END_ de _TOTAL_ Compras',
        infoEmpty: 'Mostrando 0 to 0 of 0 Entradas',
        infoFiltered: '(Filtrado de _MAX_ total Compras)',
        infoPostFix: '',
        thousands: ',',
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
    // const tabladetalle = url.concat(' ').concat('tbody');
    $('.tableCredito_pagadas tbody').on('dblclick', 'tr', function() {
      const data = table.row( this ).data();
      vm.compraserv.ObtenerDetalle(data.idCompra).then(res => {
        const rpta = sendRespuesta(res);
        vm.detalleCompraPagada = rpta.data;
      });
  } );
  }
  CalcularVuelto(event) {
    const vm = this;
    if (parseFloat(vm.credito.deuda) < parseFloat(event.target.value)) {
      vm.credito.deudaporPagar = '';
      vm.credito.vuelto = calcularVuelto(vm.credito.deuda, event.target.value);
      vm.labelVueltoOrDeuda = false;
      return false;
    }
    if (parseFloat(vm.credito.deuda) >= parseFloat(event.target.value)) {
      vm.credito.vuelto = '';
      vm.credito.deudaporPagar = calcularVuelto(vm.credito.deuda, event.target.value);
      vm.labelVueltoOrDeuda = true;
      return true;
    }
    if (event.target.value === '') {
      vm.labelVueltoOrDeuda = false;
      return false;
    }
  }
  Pagar() {
    const vm = this;
    const status = vm.validarcampos();
    if (status) {
      vm.compraserv.PagosCredito(vm.credito).then( res => {
        const resp = sendRespuesta(res);
        if (resp.status === true) {
          iziToast.success({
            title: 'OK',
            position: 'topRight',
            message: resp.message,
          });
          vm.borrarCredito();
          $('#modalPagarCredito').modal('hide');
          vm.Listar(vm.params);
         }
      }).catch((e) => {
        alert(e);
      }).then(() => {
          console.log('after a catch the chain is restored');
        }, () => {
          console.log('Not fired due to the catch');
        });
    }
  }
  validarcampos() {
    const vm = this;
    if (!vm.credito.deuda) {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'Campo deuda requerida',
      });
      return false;
    } else if (!vm.credito.monto) {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'Campo monto requerido',
      });
      return false;

    // } else if (!vm.credito.vuelto) {
    //   iziToast.error({
    //     title: 'Error',
    //     position: 'topRight',
    //     message: 'campo vuelto or Deuda requerido',
    //   });
      return false;
    }
    return true;
  }
  borrarCredito() {
    const vm = this;
    vm.credito.deuda = '';
    vm.credito.deudaporPagar = '';
    vm.credito.idCompra = 0;
    vm.credito.idVendedor = '';
    vm.credito.monto = '';
    vm.credito.vuelto = '';
  }
  verComprobante(value: any) {
    const vm = this;
    const url = URL.createObjectURL('3f104f95-c3ee-4126-8a4c-1757acfcf354_1616589571.jpg');
    window.open(url);
    // this.compraserv.verPdf1(value.idCompra).then(res => {
    //   console.log(res);
    // });
  }
}
