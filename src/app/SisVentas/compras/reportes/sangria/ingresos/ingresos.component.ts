import { Component, EventEmitter, OnInit, Output } from '@angular/core';
declare const $: any;
@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styleUrls: ['./ingresos.component.sass']
})
export class IngresosComponent implements OnInit {
  total = 0;
  @Output() sendIngresoxid = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }
  FetchIngresos(ingresos, total) {
    const vm = this;
    vm.total = total;
    vm.datatable(ingresos, '.ingresos');
  }
  datatable(datos, table) {
    const vm = this;
    $(table).DataTable({
      "lengthMenu": [[10, 20, 50], [10, 20, 50]],
      data: datos,
      columns: [
      { data: 'per_nombre'},
      {data:  'ca_name' },
      {data:  'san_fecha'},
      {data: 'san_tipo_sangria',
      render() {
        return '<span _ngcontent-nly-c9="" class="label bg-green shadow-style">Ingresos</span>';
      },
      },
      {data: 'san_motivo'},
      {data: 'san_monto'},
      { data: () => {
        return (
          '<button _ngcontent-smb-c6="" class="btn btn-success waves-effect edit" type="button">' +
          '<i *ngIf="accion" title="Actualizar Informacion" _ngcontent-lbr-c10="" class="fas fa-edit"></i>' +
          '</button>'
        );
      }
      },
      ],
      responsive: true,
      rowCallback: ( row, data ) => {
        $('td', row).css('cursor', 'pointer');
        $('.edit', row).bind('click' , (e) => {
          vm.Editar(data);
        });
      },
      language: {
        decimal: '',
        emptyTable: 'No exsiten Ingresos',
        info: 'Mostrando _START_ a _END_ de _TOTAL_ Ingresos',
        infoEmpty: 'Mostrando 0 to 0 of 0 Entradas',
        infoFiltered: '(Filtrado de _MAX_ total Ingresos)',
        infoPostFix: '',
        thousands: ',',
        lengthMenu: 'Mostrar _MENU_ Ingresos',
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
      destroy: true,
    });
  }
  Editar(value: any) {
    const vm = this;
    vm.sendIngresoxid.emit(value);
  }
}
