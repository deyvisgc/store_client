import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { CompraService } from '../../service/compras/compra.service';
import iziToast from 'izitoast';
declare const $: any;
declare const sendRespuesta: any;
@Component({
  selector: 'app-compras-vigentes',
  templateUrl: './compras-vigentes.component.html',
  styleUrls: ['./compras-vigentes.component.sass']
})
export class ComprasVigentesComponent implements OnInit {
  mensaje;
  params = {
    numeroCompra   : '',
    fechaDesde     : '',
    fechaHasta     :  '',
    codeProveedor  : '',
    tipoPago       : '',
    tipoComprobante: ''
  };
  @Output() sendIdCompra = new EventEmitter<any>();
  @Output() sendIdCompraEstado = new EventEmitter<number>();
  @Output() sendIdCompraExcel = new EventEmitter<number>();
  constructor(private dynamicScriptLoader: DynamicScriptLoaderService, private compraserv: CompraService) { }
  async startScript() {
    await this.dynamicScriptLoader.load('form.min').then(data => {
    }).catch(error => console.log(error));
  }
  ngOnInit() {
  }
  FetchVigentes(params) {
    const vm = this;
    vm.compraserv.Compras(params).then(res => {
      const rpata = sendRespuesta(res);
      const vigentes = rpata.data.filter(f => f.comEstado === 1);
      const anuladas = rpata.data.filter(f => f.comEstado === 0);
      const credito = rpata.data.filter(f => f.comTipoPago === 'credito');
      const contado = rpata.data.filter(f => f.comTipoPago === 'contado');
      const lista = [];
      lista.push(vigentes.length, anuladas, credito, contado);
      this.compraserv.SendListasCompras(lista);
      vm.datatable('.table-vigente', vigentes);
    }).catch((e) => {
      alert(e);
    }).then(() => {
      console.log('after a catch the chain is restored');
    }, () => {
      console.log('Not fired due to the catch');
    });
  }
  datatable(tabla, datos) {
    const vm = this;
    $(tabla).DataTable({
      "lengthMenu": [[10, 20, 50], [10, 20, 50]],
      data: datos,
      columns: [
        { data: 'comSerieCorrelativo'},
       { data: 'razonSocial',
       render( data, type, row ) {
        return row.razonSocial ;
       },
      },
      { data: 'comFecha' },
      {data: 'comTipoComprobante'},
      {data: 'comSerieComprobante'},
      {data: 'comTipoPago'},
      {data: 'comTotal'},
      {data: 'comEstado',
      render(data, type, row) {
        if (row.comEstado  === 1) {
          return '<span _ngcontent-nly-c9="" class="label bg-green shadow-style">Vigente</span>';
        }
      },
      },
      { data: (data) => {
        return (
          '<div _ngcontent-aai-c5="" class="btn-group" style="margin-left: 20px;">' +
          '<button _ngcontent-aai-c5="" aria-expanded="false" aria-haspopup="true" class="btn btn-primary dropdown-toggle"' +
          'data-toggle="dropdown" type="button"><i _ngcontent-eev-c7="" class="fas fa-align-justify"></i>' +
          '<span _ngcontent-aai-c5="" class="caret">' +
          '</span></button><ul _ngcontent-aai-c5="" class="dropdown-menu"><li _ngcontent-aai-c5="">' +
          '<li _ngcontent-aai-c5=""><a _ngcontent-aai-c5="" class="detalleCompra">' +
          '<i _ngcontent-ogf-c5="" class="fas fa-eye"></i> Detalle</a></li>' +
          '<li _ngcontent-aai-c5=""><a _ngcontent-aai-c5="" class="anular">' +
          '<i _ngcontent-ccs-c5="" class="fas fa-times-circle"></i> Anular</a></li>' +
          '<li _ngcontent-aai-c5="">' +
          '</li><li _ngcontent-aai-c5="">' +
          '<a _ngcontent-aai-c5="" class="exportarExcelDetalle">' +
          '<i _ngcontent-toy-c5="" style="color: black;font-weight: bold;" class="far fa-file-excel "></i>' +
          '<span > Exportar</span></a></li></ul></div>'
        );
      }
      },
      ],
      responsive: true,
      rowCallback: ( row, data ) => {
        $('td', row).css('cursor', 'pointer');
        $('.exportarExcelDetalle', row).bind('click' , (e) => {
          vm.exportarExcelDetalle(data);
        });
        $('.detalleCompra', row).bind('click' , (e) => {
          vm.detalleCompra(data);
        });
        $('.anular', row).bind('click' , (e) => {
          vm.anular(data);
        });
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
