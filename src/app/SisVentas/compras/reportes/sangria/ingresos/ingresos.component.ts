import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { ReportesService } from 'src/app/SisVentas/service/reportes/reportes.service';
declare const $: any;
declare const sendRespuesta: any;
@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styleUrls: ['./ingresos.component.sass']
})
export class IngresosComponent implements OnInit {
  total = 0;
  @Output() sendIngresoxid = new EventEmitter<any>();
  @Output() idSangria = new EventEmitter<number> ();
  constructor(private dynamicScriptLoader: DynamicScriptLoaderService, private reporteSer: ReportesService) { }

  ngOnInit() {
    this.startScript();
  }
  async startScript() {
    await this.dynamicScriptLoader.load('form.min').then(data => {
      this.loadData();
    }).catch(error => console.log(error));
  }
  private loadData() {
    const vm = this;
  }
  FetchIngresos(params, ingresos, total) {
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
          '<div _ngcontent-aai-c5="" class="btn-group" style="margin-left: 20px;">' +
          '<button _ngcontent-aai-c5="" aria-expanded="false" aria-haspopup="true" class="btn btn-primary dropdown-toggle"' +
          'data-toggle="dropdown" type="button"><i _ngcontent-eev-c7="" class="fas fa-align-justify"></i>' +
          '<span _ngcontent-aai-c5="" class="caret">' +
          '</span></button><ul _ngcontent-aai-c5="" class="dropdown-menu"><li _ngcontent-aai-c5="">' +
          '<li _ngcontent-aai-c5=""><a _ngcontent-aai-c5="" style="cursor: pointer" class="edit">' +
          '<i _ngcontent-ogf-c5="" class="fas fa-eye"></i> Editar</a></li>' +
          '<li _ngcontent-aai-c5=""><a _ngcontent-aai-c5="" style="cursor: pointer" class="anular">' +
          '<i _ngcontent-ccs-c5="" class="fas fa-times-circle"></i> Anular</a></li>' +
          '<li _ngcontent-aai-c5="">' +
          '</li>'
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
        $('.anular', row).bind('click' , (e) => {
          vm.Anular(data);
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
  Anular(value) {
    const vm = this;
    vm.idSangria.emit(value.id_sangria);
  }
}
