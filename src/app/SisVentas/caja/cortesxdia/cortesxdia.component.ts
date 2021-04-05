import { Component, OnInit } from '@angular/core';
declare const flatpickr: any;
declare const $: any;
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { CajaService } from '../../service/caja/caja.service';
import * as moment from 'moment';
@Component({
  selector: 'app-cortesxdia',
  templateUrl: './cortesxdia.component.html',
  styleUrls: ['./cortesxdia.component.css']
})
export class CortesxdiaComponent implements OnInit {
  fechaHoy = moment().format('YYYY-MM-DD');
  monedasList: any = [];
  totalesarray: any = [];
  table;
  subtotal = 0;
  total = '';
  constructor(private dynamicScriptLoader: DynamicScriptLoaderService, private cajaSer: CajaService) { }
   monedas = [
     {
     value: 0.10,
     descripcion : 'S/ 0.10',
     cantidad: 0,
     total: 0
     },
     {
      value: 0.20,
      descripcion : 'S/ 0.20',
      cantidad: 0,
      total: 0
     },
     {
      value: 0.50,
      descripcion : 'S/ 0.50',
      cantidad: 0,
      total: 0
     },
     {
      value: 1.00,
      descripcion : 'S/ 1.00',
      cantidad: 0,
      total: 0,
     },
     {
      value: 2.00,
      descripcion : 'S/ 2.00',
      cantidad: 0,
      total: 0
     },
     {
      value: 5.00,
      descripcion : 'S/ 5.00',
      cantidad: 0,
      total: 0
     },

   ];
   billetes = [
    {
    value: 10.00,
    descripcion : 'S/ 10.00'
    },
    {
     value: 20.00,
     descripcion : 'S/ 20.00'
    },
    {
     value: 50.00,
     descripcion : 'S/ 50.00'
    },
    {
     value: 100.00,
     descripcion : 'S/ 100.00'
    },
    {
     value: 200.00,
     descripcion : 'S/ 200.00'
    }
  ];
  ngOnInit() {
    this.startScript();
  }
  async startScript() {
    const vm = this;
    vm.monedasList = this.monedas;
    vm.datatable(vm.monedasList, '.monedas');
    await this.dynamicScriptLoader.load('form.min').then(data => {
      flatpickr('.fechaDesde', {
        locale: Spanish,
        defaultDate: [this.fechaHoy]
      });
      flatpickr('#horaInicio', {
        dateFormat: 'H:i',
        enableTime: true,
        allowInput: true,
        noCalendar: true
      });
      flatpickr('#horaTermino', {
        dateFormat: 'H:i',
        enableTime: true,
        allowInput: true,
        noCalendar: true
      });
    }).catch(error => console.log(error));
  }
  calcularTotalMoneda(event) {
     const diescentimos = $('table tr:nth-child(1) td:first-child').html();
     const veintecentimos = $('table tr:nth-child(1) td:first-child').html();
     console.log(diescentimos);
  }
  datatable(datos, table) {
    const vm = this;
    vm.table =  $(table).DataTable({
      data: datos,
      columns: [
      { data: 'descripcion'},
      { data: (row, data) => {
        // tslint:disable-next-line:max-line-length
        return '<input id="cantidad_table" style="height: 1rem !important;border-bottom: 0px solid #9e9e9e !important;text-align: center;"  type="text" class="calculartoal" value=' + 0 + '>';
      }
      },
      { data: (row, data) => {
        // tslint:disable-next-line:max-line-length
        return ' <span id="total" class="badge bg-green value">' + 0 + '</span>';
      }
      },
      ],
      responsive: true,
      rowCallback: ( row, data ) => {
        $('td', row).css('cursor', 'pointer');
        $('.calculartoal', row).bind('keyup' , (e) => {
          const valor = vm.calculartotal(data, e);
          $('td:eq(2)', row).html(valor);
          let total = 0;
          $('.monedas tbody').find('tr').each(function (i, el) {
            total += parseFloat($(this).find('td').eq(2).text());
          });
          vm.total = total.toFixed(2);
        });
      },
      order: [],
      destroy: true,
      "searching": false,
      "lengthChange": false,
      "paging": false,
      "info": false
    });
  }
  calculartotal(data, event) {
    let total = parseFloat(data.value)  * parseFloat(event.target.value);
    if (isNaN(total)) {
        total = 0;
    }
    return total.toFixed(2);
  }
}
