import { Component, EventEmitter, OnInit, Output } from '@angular/core';
declare const $: any;
@Component({
  selector: 'app-egresos',
  templateUrl: './egresos.component.html',
  styleUrls: ['./egresos.component.sass']
})
export class EgresosComponent implements OnInit {
 total = 0;
 @Output() sendSalidaxid = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }
  FetchSalidas(salidas, total) {
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
  Editar(value: any) {
    const vm = this;
    vm.sendSalidaxid.emit(value);
  }
}
