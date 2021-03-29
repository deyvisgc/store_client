import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { CompraService } from '../../service/compras/compra.service';
import iziToast from 'izitoast';
declare const $: any;
declare const sendRespuesta: any;
declare const calcularVuelto: any;
@Component({
  selector: 'app-compras-credito',
  templateUrl: './compras-credito.component.html',
  styleUrls: ['./compras-credito.component.css']
})
export class ComprasCreditoComponent implements OnInit {
  // idCompra;
  table;
  @Output() sendIdCompra = new EventEmitter<any>();
  @Output() sendIdCompraEstado = new EventEmitter<number>();
  @Output() sendIdCompraExcel = new EventEmitter<number>();
  credito = {
    deuda: '',
    monto: '',
    vuelto: '',
    idVendedor: 1,
    idCompra : 0,
    idVenta: 0,
    deudaporPagar : ''
  };
  parmeters = {};
  labelVueltoOrDeuda = false;
  inputllenos = false;
  constructor(private dynamicScriptLoader: DynamicScriptLoaderService, private compraserv: CompraService) { }

  ngOnInit() {
  }
  async startScript() {
    await this.dynamicScriptLoader.load('form.min').then(data => {
    }).catch(error => console.log(error));
  }
  FetchCredito(data, params) {
    const vm = this;
    if (data.length === 0) {
      params.tabla = 'credito';
      vm.parmeters = params;
      vm.compraserv.ShowActiveTab(4);
      vm.compraserv.Compras(vm.parmeters).then( res => {
        const rpta = sendRespuesta(res);
        vm.datatable('.table-creditos', rpta.data);
      }).catch((e) => {
        alert(e);
      }).then(() => {
          console.log('after a catch the chain is restored');
      }, () => {
          console.log('Not fired due to the catch');
      });
    } else {
      vm.datatable('.table-creditos', data);
    }
  }
  datatable(tabla, datos) {
    const vm = this;
    vm.table = $(tabla).DataTable({
      "lengthMenu": [[10, 20, 50], [10, 20, 50]],
      data: datos,
      columns: [
      { data: 'comSerieCorrelativo'},
      { data: 'razonSocial',
       render( data, type, row ) {
        return row.razonSocial ;
       },
      },
      {data: 'comFecha' },
      {data: 'comTipoComprobante'},
      {data: 'comMontoPagado'},
      {data: 'comMontoDeuda'},
      {data: 'comTotal'},
      {data: 'comEstadoTipoPago',
      render(data, type, row) {
        if (row.comEstadoTipoPago  === 1) {
          return '<span _ngcontent-nly-c9="" class="label bg-red shadow-style">Deudor</span>';
        } else {
          return '<span _ngcontent-nly-c9="" class="label bg-green shadow-style">Cancelado</span>';
        }
      },
      },
      {data: 'comEstado',
      render(data, type, row) {
        if (row.comEstado  === 1) {
          return '<span _ngcontent-nly-c9="" class="label bg-green shadow-style">Vigente</span>';
        } else {
          return '<span _ngcontent-nly-c9="" class="label bg-red shadow-style">Anulado</span>';
        }
      },
      },
      { data: (data) => {
        let btnEstado = '';
        let btnPagar = '';
        if (data.comEstado === 1) {
          btnEstado = '<li _ngcontent-aai-c5=""><a _ngcontent-aai-c5="" class="anular">' +
                '<i _ngcontent-ccs-c5="" class="fas fa-times-circle"></i> Anular</a></li>';
        } else {
          btnEstado = '<li _ngcontent-aai-c5=""><a _ngcontent-aai-c5="" class="anular">' +
          '<i _ngcontent-ccs-c5="" class="fas fa-times-circle"></i>Activar</a></li>';
        }
        if (data.comEstadoTipoPago === 1) {
          btnPagar = '<li _ngcontent-aai-c5=""> <a _ngcontent-aai-c5="" class="pagarCredito">' +
          '<i _ngcontent-mqk-c6=""  class="fab fa-cc-visa"></i> <span class"btncredito">Pagar</span></a></li>';
        } else {
          btnPagar = '';
        }
        return (
                '<div _ngcontent-aai-c5="" class="btn-group" style="margin-left: 20px;">' +
                '<button _ngcontent-aai-c5="" aria-expanded="false" aria-haspopup="true" class="btn btn-primary dropdown-toggle"' +
                'data-toggle="dropdown" type="button"><i _ngcontent-eev-c7="" class="fas fa-align-justify"></i>' +
                '<span _ngcontent-aai-c5="" class="caret">' +
                '</span></button><ul _ngcontent-aai-c5="" class="dropdown-menu">' +
                btnPagar + '<li _ngcontent-aai-c5=""><a _ngcontent-aai-c5="" class="detalleCompra">' +
                '<i _ngcontent-ogf-c5="" class="fas fa-eye"></i> Detalle</a>' +
                btnEstado + '<li _ngcontent-aai-c5=""></li><li _ngcontent-aai-c5="">' +
                '<a _ngcontent-aai-c5="" class="exportarExcelDetalle">' +
                '<i _ngcontent-toy-c5="" style="color: black;font-weight: bold;" class="far fa-file-excel "></i>' +
                '<span > Exportar</span></a></li></ul></div>');
      }
      },
      ],
      responsive: true,
      rowCallback: ( row, data ) => {
        // $('.verComprobante', row).bind('click' , (e) => {
        //   vm.verComprobante(data);
        // });
        $('.pagarCredito', row).bind('click', () => {
          vm.credito.deuda = data.comMontoDeuda;
          vm.credito.idCompra = data.idCompra;
          $('#modalPagarCredito').modal('show');
        });
        $('.exportarExcelDetalle', row).bind('click' , (e) => {
          vm.exportarExcelDetalle(data);
        });
        $('.detalleCompra', row).bind('click' , (e) => {
          vm.detalleCompra(data);
        });
        $('.anular', row).bind('click' , (e) => {
          vm.anular(data);
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
    $('.table-creditos tbody').on('dblclick', 'tr', function() {
      const data = vm.table.row( this ).data();
      vm.detalleCompra(data);
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
          vm.FetchCredito([], vm.parmeters);
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
    vm.credito.idVendedor = 0;
    vm.credito.monto = '';
    vm.credito.vuelto = '';
  }
  exportarExcelDetalle(value: any) {
    const vm = this;
    vm.sendIdCompraExcel.emit(value.idCompra);
  }
  anular(value: any) {
    const vm = this;
    vm.sendIdCompraEstado.emit(value.idCompra);
  }
  detalleCompra(value) {
    const vm = this;
    vm.sendIdCompra.emit(value);
  }
}
