import { Component, OnInit } from '@angular/core';
declare const $: any;
@Component({
  selector: 'app-viernes',
  templateUrl: './viernes.component.html',
  styleUrls: ['./viernes.component.css']
})
export class ViernesComponent implements OnInit {

  monedasarray: any = [];
  billetesarray: any = [];
  cajaAdd = [];
  totalMonedas = '';
  totalBilletes = '';
  monedas = [
    {
    value: 0.10,
    descripcion : 'S/ 0.10'
    },
    {
     value: 0.20,
     descripcion : 'S/ 0.20'
    },
    {
     value: 0.50,
     descripcion : 'S/ 0.50'
    },
    {
     value: 1.00,
     descripcion : 'S/ 1.00'
    },
    {
     value: 2.00,
     descripcion : 'S/ 2.00'
    },
    {
     value: 5.00,
     descripcion : 'S/ 5.00'
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
  constructor() { }

  ngOnInit() {
    this.datatableMonedas(this.monedas, '.monedas');
    this.datatableBilletes(this.billetes, '.billetes');
  }
  calculartotal(data, event) {
    let total = parseFloat(data.value)  * parseFloat(event.target.value);
    if (isNaN(total)) {
        total = 0;
    }
    return total.toFixed(2);
  }
  datatableMonedas(datos, table) {
    const vm = this;
    $(table).DataTable({
      data: datos,
      columns: [
      { data: 'descripcion'},
      { data: (row, data) => {
        // tslint:disable-next-line:max-line-length
        return '<input id="cantidad_table" style="height: 1rem !important;border-bottom: 0px solid #9e9e9e !important;text-align: center;"  type="number" class="calculartoal" value=' + 0 + '>';
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
          vm.totalMonedas =  parseFloat(total.toString()).toFixed(2);
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
  datatableBilletes(datos, table) {
    const vm = this;
    $(table).DataTable({
      data: datos,
      columns: [
      { data: 'descripcion'},
      { data: (row, data) => {
        // tslint:disable-next-line:max-line-length
        return '<input id="cantidad_table" style="height: 1rem !important;border-bottom: 0px solid #9e9e9e !important;text-align: center;"  type="number" class="calculartoal" value=' + 0 + '>';
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
          $('.billetes tbody').find('tr').each(function (i, el) {
            total += parseFloat($(this).find('td').eq(2).text());
          });
          vm.totalBilletes =  parseFloat(total.toString()).toFixed(2);
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

}
