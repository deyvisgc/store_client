import { Component, OnInit } from '@angular/core';
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
      const vigentes = rpata.data.filter(f => f.comEstado !== 0);
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
        if (data.comEstado === '1') {
          // tslint:disable-next-line:max-line-length
          return (`<button _ngcontent-njl-c5="" class="btn bg-teal btn-circle waves-effect waves-circle waves-float pagarCredito" type="button"><i _ngcontent-mqk-c6="" style="color:white" class="fab fa-cc-visa"></i></button> <button style="margin-left:5px" _ngcontent-qan-c5="" class="btn btn-danger btn-circle waves-effect waves-circle waves-float verComprobante" type="button"><i _ngcontent-mqs-c7="" class="fas fa-file-pdf"></i></button>` +
                  // tslint:disable-next-line:max-line-length
                  '<button _ngcontent-cba-c19="" [disabled]="cargandoInformacion" style="margin-left: 5px;" class="btn btn-success btn-circle waves-effect waves-circle waves-float  exportarExcelDetalle" type="button"><i _ngcontent-wdf-c5="" class="fas fa-file-excel"></i></button>');
        } else {
          // tslint:disable-next-line:max-line-length
          return (`<button style="margin-left:5px" _ngcontent-qan-c5="" class="btn btn-danger btn-circle waves-effect waves-circle waves-float verComprobante" type="button"><i _ngcontent-mqs-c7="" class="fas fa-file-pdf"></i></button>` +
          // tslint:disable-next-line:max-line-length
          '<button _ngcontent-cba-c19="" [disabled]="cargandoInformacion" style="margin-left: 5px;" class="btn btn-success  btn-circle waves-effect waves-circle waves-float exportarExcelDetalle" type="button"><i _ngcontent-wdf-c5="" class="fas fa-file-excel"></i></button>');
        }
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
