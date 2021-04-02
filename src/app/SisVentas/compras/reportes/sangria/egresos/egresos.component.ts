import { Component, OnInit } from '@angular/core';
declare const $: any;
declare const sendRespuesta: any;
@Component({
  selector: 'app-egresos',
  templateUrl: './egresos.component.html',
  styleUrls: ['./egresos.component.sass']
})
export class EgresosComponent implements OnInit {
 total = 0;
  constructor() { }

  ngOnInit() {
  }
  FetchSalidas(params, salidas, total) {
    const vm = this;
    vm.datatable(salidas);
    vm.total = total;
  }
  datatable(datos) {
    const vm = this;
    $('.table-salidas').DataTable({
      "lengthMenu": [[10, 20, 50], [10, 20, 50]],
      data: datos,
      columns: [
      { data: 'per_nombre'},
      {data:  'ca_name' },
      {data:  'san_fecha'},
      {data: 'san_tipo_sangria',
      render() {
        return '<span _ngcontent-nly-c9="" class="label bg-red shadow-style">Salidas</span>';
      },
      },
      {data: 'san_motivo'},
      {data: 'san_monto'},
      { data: () => {
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
      },
      language: {
        decimal: '',
        emptyTable: 'No exsiten salidas',
        info: 'Mostrando _START_ a _END_ de _TOTAL_ Salidad',
        infoEmpty: 'Mostrando 0 to 0 of 0 Entradas',
        infoFiltered: '(Filtrado de _MAX_ total Salidas)',
        infoPostFix: '',
        thousands: ',',
        lengthMenu: 'Mostrar _MENU_ Salidas',
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
}
