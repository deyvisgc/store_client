import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CajaService } from 'src/app/SisVentas/service/caja/caja.service';
declare const $: any;
declare const sendRespuesta: any;
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
  saldoInicio = 0;
  total = 0;
  monedas = [
    {
    value: 0.10,
    cantidad : 0,
    subtotal : 0,
    },
    {
     value: 0.20,
     cantidad : 0,
     subtotal : 0
    },
    {
     value: 0.50,
     cantidad : 0,
     subtotal : 0
    },
    {
     value: 1.00,
     cantidad : 0,
     subtotal : 0
    },
    {
     value: 2.00,
     cantidad : 0,
     subtotal : 0
    },
    {
     value: 5.00,
     cantidad : 0,
     subtotal : 0
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
  constructor(private cajaSer: CajaService, private rutaActiva: ActivatedRoute,) { }

  ngOnInit() {
  }
  calculartotal(data, index, event) {
    console.log(index);
    let total = parseFloat(data.value)  * parseFloat(event.target.value);
    data.cantidad = event.target.value;
    if (isNaN(total)) {
        total = 0;
    }
    return total.toFixed(2);
  }
  calcular(event, mo, index) {
    mo.contidad = event.target.value;
    console.log(mo[index].cantidad = event.target.value);
    console.log(mo[index].subtotal = mo[index].value * event.target.value);
    // alert(parseFloat(event.target.value));
  }
  // datatableMonedas(datos, table) {
  //   const vm = this;
  //   $(table).DataTable({
  //     data: datos,
  //     columns: [
  //     { data: 'descripcion'},
  //     { data: (row, data) => {
  //       // tslint:disable-next-line:max-line-length
  //       return '<input id="cantidad_table" style="height: 1rem !important;border-bottom: 0px solid #9e9e9e !important;text-align: center;"  type="number" class="calculartoal" value=' + row.cantidad + '>';
  //     }
  //     },
  //     { data: (row, data) => {
  //       // tslint:disable-next-line:max-line-length
  //       return ' <span id="total" class="badge bg-green value">' + row.subtotal + '</span>';
  //     }
  //     },
  //     ],
  //     responsive: true,
  //     rowCallback: ( row, data ) => {
  //       $('td', row).css('cursor', 'pointer');
  //       $('.calculartoal', row).bind('keyup' , (e) => {
  //         const valor = vm.calculartotal(data, row().index(), e);
  //         $('td:eq(2)', row).html(valor);
  //         let total = 0;
  //         $('.monedas tbody').find('tr').each(function (i, el) {
  //           total += parseFloat($(this).find('td').eq(2).text());
  //         });
  //         vm.totalMonedas =  parseFloat(total.toString()).toFixed(2);
  //       });
  //     },
  //     order: [],
  //     destroy: true,
  //     "searching": false,
  //     "lengthChange": false,
  //     "paging": false,
  //     "info": false
  //   });
  // }
  // datatableBilletes(datos, table) {
  //   const vm = this;
  //   $(table).DataTable({
  //     data: datos,
  //     columns: [
  //     { data: 'descripcion'},
  //     { data: (row, data) => {
  //       // tslint:disable-next-line:max-line-length
  //       return '<input id="cantidad_table" style="height: 1rem !important;border-bottom: 0px solid #9e9e9e !important;text-align: center;"  type="number" class="calculartoal" value=' + 0 + '>';
  //     }
  //     },
  //     { data: (row, data) => {
  //       // tslint:disable-next-line:max-line-length
  //       return ' <span id="total" class="badge bg-green value">' + 0 + '</span>';
  //     }
  //     },
  //     ],
  //     responsive: true,
  //     rowCallback: ( row, data ) => {
  //       $('td', row).css('cursor', 'pointer');
  //       $('.calculartoal', row).bind('keyup' , (e) => {
  //         const valor = vm.calculartotal(data, row().index(), e);
  //         $('td:eq(2)', row).html(valor);
  //         let total = 0;
  //         $('.billetes tbody').find('tr').each(function (i, el) {
  //           total += parseFloat($(this).find('td').eq(2).text());
  //         });
  //         vm.totalBilletes =  parseFloat(total.toString()).toFixed(2);
  //       });
  //     },
  //     order: [],
  //     destroy: true,
  //     "searching": false,
  //     "lengthChange": false,
  //     "paging": false,
  //     "info": false
  //   });
  // }
  obtenerSaldoInicio() {
    const vm = this;
    vm.cajaSer.ObtenerSaldoInicial(vm.rutaActiva.snapshot.params.idCaja).then(res => {
    const rpta = sendRespuesta(res);
    if (rpta.status) {
      // iziToast.success({
      //   title: 'OK',
      //   position: 'topRight',
      //   message: rpta.message,
      // });
      vm.saldoInicio =  rpta.data[0].saldoInicial;
    } else {
    }
    }).catch((err) => {

    }).then(() => {
    }, () => {
      console.log('error');
    });
  }
  verdata() {
    console.log(this.monedas);
  }
}
