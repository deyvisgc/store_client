import { Component, OnInit } from '@angular/core';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { CompraService } from '../../service/compras/compra.service';
import iziToast from 'izitoast';
declare const $: any;
declare const sendRespuesta: any;
@Component({
  selector: 'app-compras-anuladas',
  templateUrl: './compras-anuladas.component.html',
  styleUrls: ['./compras-anuladas.component.sass']
})
export class ComprasAnuladasComponent implements OnInit {
  params = {
    numeroCompra   : '',
    fechaDesde     : '',
    fechaHasta     :  '',
    codeProveedor  : '',
    tipoPago       : '',
    tipoComprobante: ''
  };
  constructor(private dynamicScriptLoader: DynamicScriptLoaderService, private compraserv: CompraService) { }
  async startScript() {
    await this.dynamicScriptLoader.load('form.min').then(data => {
    }).catch(error => console.log(error));
  }
  ngOnInit() {
  }
  FetchAnuladas(data, params) {
    const vm = this;
    vm.datatable('.table-anulados', data);
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
        if (row.comEstado  === 0) {
          return '<span _ngcontent-nly-c9="" class="label bg-red shadow-style">Anuladas</span>';
        }
      },
      },
      { data: (data) => {
        // tslint:disable-next-line:max-line-length
        return (`<button style="margin-left:5px" _ngcontent-qan-c5="" class="btn btn-danger btn-circle waves-effect waves-circle waves-float verComprobante" type="button"><i _ngcontent-mqs-c7="" class="fas fa-file-pdf"></i></button>` +
        // tslint:disable-next-line:max-line-length
        '<button _ngcontent-cba-c19="" style="margin-left: 5px;" class="btn btn-success btn-circle waves-effect waves-circle waves-float  exportarExcelDetalle" type="button"><i _ngcontent-wdf-c5="" class="fas fa-file-excel"></i></button>');
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
