import { Component, OnInit  } from '@angular/core';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { CompraService } from '../../service/compras/compra.service';
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
  table;
  detalleCompra: any = [];
  credito = {
    deuda: '',
    monto: '',
    vuelto: '',
    idVendedor: localStorage.getItem('vendedor'),
    idCompra : 0,
    idVenta: 0
  };
  ngOnInit() {
    this.startScript();
    console.log('datos', this.detalleCompra);
    localStorage.setItem('vendedor', '2');
  }
  async startScript() {
    await this.dynamicScriptLoader.load('form.min').then(data => {
    }).catch(error => console.log(error));
  }
  Listar(params) {
    const vm = this;
    vm.compraserv.ComprasACredito(params).then(res => {
      console.log('res: ', res);
      const rpta = sendRespuesta(res);
      if (rpta.data.length > 0) {
        vm.datatable('.tableCredito', rpta.data);
      } else {
        vm.datatable('.tableCredito', []);
      }
    });
  }
  datatable(url, datos) {
    const vm = this;
    vm.table = $(url).DataTable({
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
         if (row.comEstado  === '1') {
          return '<span _ngcontent-nly-c9="" class="label bg-red shadow-style">Debe</span>';
         } else if (row.comEstado  === '2') {
          return '<span _ngcontent-nly-c9="" class="label bg-green shadow-style">Pagado</span>';
         }
       },
      },
      {data: 'com_cuotas'},
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
          vm.PagarDeuda(data);
        });
        $('.verComprobante', row).bind('keyup.enter' , (e) => {
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
    $('.tableCredito tbody').on('dblclick', 'tr', function() {
      const data = vm.table.row( this ).data();
      vm.compraserv.ObtenerDetalle(data.idCompra).then(res => {
        const rpta = sendRespuesta(res);
        vm.detalleCompra = rpta.data;
      });
  } );
  }
  CalcularVuelto(event) {
    const vm = this;
    vm.credito.vuelto = calcularVuelto(vm.credito.deuda, event.target.value);
    console.log(event.target.value);
    if (parseFloat(vm.credito.deuda) < parseFloat(event.target.value)) {
      vm.labelVueltoOrDeuda = false;
      return false;
    } else if (event.target.value === '') {
      vm.labelVueltoOrDeuda = false;
      return false;
    }
    vm.labelVueltoOrDeuda = true;
    return true;
  }
  PagarDeuda(value: any) {
    const vm = this;
    vm.credito.deuda = value.comMontoDeuda;
    vm.credito.idCompra = value.idCompra;
    $('#modalPagarCredito').modal('show');
  }
}
