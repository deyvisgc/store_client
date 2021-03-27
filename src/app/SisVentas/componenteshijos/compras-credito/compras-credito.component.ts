import { Component, OnInit } from '@angular/core';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { CompraService } from '../../service/compras/compra.service';
import iziToast from 'izitoast';
declare const $: any;
declare const sendRespuesta: any;
@Component({
  selector: 'app-compras-credito',
  templateUrl: './compras-credito.component.html',
  styleUrls: ['./compras-credito.component.css']
})
export class ComprasCreditoComponent implements OnInit {

  constructor(private dynamicScriptLoader: DynamicScriptLoaderService, private compraserv: CompraService) { }

  ngOnInit() {
  }
  async startScript() {
    await this.dynamicScriptLoader.load('form.min').then(data => {
    }).catch(error => console.log(error));
  }
  FetchCredito(data, params) {
    const vm = this;
    vm.datatable('.table-creditos', data);
    // vm.compraserv.Compras(params).then(res => {
    //   const rpata = sendRespuesta(res);
    //   const lista = [];
    //   this.compraserv.SendListasCompras(lista);
    //   vm.datatable('.table-vigente', vigentes);
    // }).catch((e) => {
    //   alert(e);
    // }).then(() => {
    //   console.log('after a catch the chain is restored');
    // }, () => {
    //   console.log('Not fired due to the catch');
    // });
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
      {data: 'comFecha' },
      {data: 'comTipoComprobante'},
      {data: 'comMontoPagado'},
      {data: 'comMontoDeuda'},
      {data: 'comTotal'},
      {data: 'comEstadoTipoPago',
      render(data, type, row) {
        if (row.comEstadoTipoPago  === 1) {
          return '<span _ngcontent-nly-c9="" class="label bg-green shadow-style">Deudor</span>';
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
          return '<span _ngcontent-nly-c9="" class="label bg-green shadow-style">Anulado</span>';
        }
      },
      },
      { data: (data) => {

        return (
                '<div _ngcontent-aai-c5="" class="btn-group">' +
                '<button _ngcontent-aai-c5="" aria-expanded="false" aria-haspopup="true" class="btn btn-primary dropdown-toggle"' +
                'data-toggle="dropdown" type="button">Seleccione' +
                '<span _ngcontent-aai-c5="" class="caret">' +
                '</span></button><ul _ngcontent-aai-c5="" class="dropdown-menu"><li _ngcontent-aai-c5="">' +
                '<a _ngcontent-aai-c5="" href="#" onclick="return false;">' +
                '<i _ngcontent-mqk-c6=""  class="fab fa-cc-visa"></i> <span class"btncredito">Pagar</span></a></li>' +
                '<li _ngcontent-aai-c5=""><a _ngcontent-aai-c5="" href="#" onclick="return false;">' +
                '<i _ngcontent-ogf-c5="" class="fas fa-eye"></i> Detalle</a></li><li _ngcontent-aai-c5="">' +
                '<a _ngcontent-aai-c5="" href="#" onclick="return false;">' +
                '<i _ngcontent-ccs-c5="" class="fas fa-times-circle"></i> Anular</a></li>' +
                '<li _ngcontent-aai-c5="" class="divider" role="separator">' +
                '</li><li _ngcontent-aai-c5="">' +
                '<a _ngcontent-aai-c5="" href="#" onclick="return false;"> <i _ngcontent-toy-c5="" class="far fa-file-excel"></i>'+
                'Exportar</a></li></ul></div>');
      }
      },
      ],
      responsive: true,
      rowCallback: ( row, data ) => {
        // $('.verComprobante', row).bind('click' , (e) => {
        //   vm.verComprobante(data);
        // });
        $('.exportarExcelDetalle', row).bind('click' , (e) => {
          vm.exportarExcelDetalle(data);
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
  }
  exportarExcelDetalle(value: any) {
    const vm = this;
    vm.compraserv.DowloadExcelBuyId(value.idCompra).subscribe(data => {
      const a          = document.createElement('a');
      document.body.appendChild(a);
      const blob       = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,'})
      const url        = window.URL.createObjectURL(blob);
      a.href         = url;
      a.download     = `Reporte_Detalle_compras${((new Date()).getTime())}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
