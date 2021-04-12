import { Component, OnInit, ViewChild } from '@angular/core';
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { CajaService } from '../../service/caja/caja.service';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
declare const sendRespuesta: any;
declare const flatpickr: any;
declare const $: any;
import iziToast from 'izitoast';
@Component({
  selector: 'app-cortesxdia',
  templateUrl: './cortesxdia.component.html',
  styleUrls: ['./cortesxdia.component.css']
})
export class CortesxdiaComponent implements OnInit {
  fechaHoy = moment().format('YYYY-MM-DD');
  horaActual = moment().format('HH:mm');
  horaTermino = moment().add(7, 'hour').format('HH:mm');
  @ViewChild('isloadingModal', {static: true}) isloadingModal;
  monedasarray: any = [];
  billetesarray: any = [];
  cajaAdd = [];
  totalMonedas = 0;
  totalBilletes = 0;
  totalCobrado = '';
  saldoInicio = 0;
  totalEntregar = '';
  cargandoInformacion = true;
  constructor(private dynamicScriptLoader: DynamicScriptLoaderService,
              private cajaSer: CajaService,
              private rutaActiva: ActivatedRoute,
              private router: Router) { }
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
  corteDiario = {
    fecha: this.fechaHoy,
    horaInicio : this.horaActual,
    horaTermino: this.horaTermino,
    idCaja: this.rutaActiva.snapshot.params.idCaja,
    totalMonedas: 0,
    totalBilletes: 0,
    saldoInicio : 0,
    totalCobrado : 0,
    totalEntregado: 0
  };
  ngOnInit() {
    this.startScript();
  }
  async startScript() {
    const vm = this;
    await this.dynamicScriptLoader.load('form.min').then(data => {
      flatpickr('.fechaHoy', {
        locale: Spanish,
        defaultDate: [this.fechaHoy]
      });
      flatpickr('#horaInicio', {
        dateFormat: 'H:i',
        enableTime: true,
        allowInput: true,
        noCalendar: true,
        defaultDate : [this.horaActual]
      });
      flatpickr('#horaTermino', {
        dateFormat: 'H:i',
        enableTime: true,
        allowInput: true,
        noCalendar: true,
        defaultDate : [this.horaTermino]
      });
      vm.obtenerSaldoInicio();
      vm.datatable(vm.monedas, '.monedas');
      vm.datatableBilletes(vm.billetes, '.billetes');
    }).catch(error => console.log(error));
  }
  datatable(datos, table) {
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
          vm.totalMonedas =  total;
          vm.totalMonedas.toFixed(2);
          vm.calculartotalCobrado();
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
          vm.totalBilletes = total;
          vm.totalBilletes.toFixed(2);
          vm.calculartotalCobrado();
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
  calculartotalCobrado() {
    const vm = this;
    const saldoInicio = parseFloat(vm.saldoInicio.toString());
    const total = vm.totalMonedas + vm.totalBilletes;
    vm.totalCobrado = total.toFixed(2);
    const totalentregar = (total + saldoInicio).toFixed(2);
    vm.totalEntregar = totalentregar;
  }
  calculartotal(data, event) {
    let total = parseFloat(data.value)  * parseFloat(event.target.value);
    if (isNaN(total)) {
        total = 0;
    }
    return total.toFixed(2);
  }
  guardar() {
    const vm = this;
    vm.monedasarray = [];
    vm.billetesarray = [];
    vm.cajaAdd = [];
    $('.monedas tbody').find('tr').each(function (i, el) {
      const fila0 = $(this).find('td').eq(0).text();
      const fila1 = $(this).find('input[type="number"]').val();
      const fila2 =  $(this).find('td').eq(2).text();
      if (+fila0 !== 0 && +fila1 !== 0 && +fila2 !== 0) {
        vm.monedasarray.push({
          descripcion : fila0,
          cantidad : fila1,
          subtotal : fila2,
          type_money: 1
        });
      }
    });
    $('.billetes tbody').find('tr').each(function (i, el) {
      const fila0 = $(this).find('td').eq(0).text();
      const fila1 = $(this).find('input[type="number"]').val();
      const fila2 =  $(this).find('td').eq(2).text();
      if (+fila0 !== 0 && +fila1 !== 0 && +fila2 !== 0) {
        vm.billetesarray.push({
          descripcion : fila0,
          cantidad : fila1,
          subtotal : fila2,
          type_money: 2
        });
      }
    });
    if (vm.monedasarray.length > 0 || vm.monedasarray.length > 0) {
      vm.cajaAdd.push({
        monedas: vm.monedasarray,
        billetes: vm.billetesarray,
        corteSemanal: false
      });
    }
    if (vm.cajaAdd.length === 0) {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'se necesita como minimo un iten para guardar esta informacion',
      });
      return false;
    }
    vm.corteDiario.totalMonedas = vm.totalMonedas;
    vm.corteDiario.totalBilletes = vm.totalBilletes;
    vm.corteDiario.saldoInicio = vm.saldoInicio;
    vm.corteDiario.totalCobrado = parseFloat(vm.totalCobrado);
    vm.corteDiario.totalEntregado = parseFloat(vm.totalEntregar);
    vm.isloadingModal.openModal('Guardando corte de caja');
    vm.cajaSer.GuardarCorteDiario(vm.cajaAdd, vm.corteDiario).then(res => {
      const rpta = sendRespuesta(res);
      if (rpta.status) {
        iziToast.success({
          title: 'OK',
          position: 'topRight',
          message: rpta.message,
        });
        vm.Limpiartotales();
      } else {
        console.log(rpta.message);
      }
    }).catch((err) => {
      console.log(err);
    }).then(() => {
      vm.isloadingModal.closeModal();
    }, () => {
      console.log('error');
    });
  }
  obtenerSaldoInicio() {
    const vm = this;
    vm.cajaSer.ObtenerSaldoInicial(vm.rutaActiva.snapshot.params.idCaja).then(res => {
    const rpta = sendRespuesta(res);
    if (rpta.status) {
      iziToast.success({
        title: 'OK',
        position: 'topRight',
        message: rpta.message,
      });
      vm.cargandoInformacion = true;
      vm.saldoInicio =  rpta.data[0].saldoInicial;
    } else {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: rpta.message,
      });
      vm.cargandoInformacion = false;
    }
    }).catch((err) => {

    }).then(() => {
    }, () => {
      console.log('error');
    });
  }
  volveracaja() {
    this.router.navigate(['Caja/Administrar']);
  }
  Limpiartotales() {
    const vm = this;
    vm.corteDiario.fecha = vm.fechaHoy;
    vm.corteDiario.horaInicio = vm.horaActual;
    vm.corteDiario.horaTermino = vm.horaTermino;
    vm.totalBilletes = 0;
    vm.totalMonedas = 0;
    vm.totalCobrado = '';
    vm.totalEntregar = '';
    vm.datatable(vm.monedas, '.monedas');
    vm.datatableBilletes(vm.billetes, '.billetes');
  }
  Arqueo() {
    this.router.navigate(['Caja/Administrar/Arqueo/' + 2]);
  }
}
