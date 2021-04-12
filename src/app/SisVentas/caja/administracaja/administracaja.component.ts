import { Component, OnInit, ViewChild } from '@angular/core';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { CajaService } from '../../service/caja/caja.service';
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import swal from 'sweetalert2';
import iziToast from 'izitoast';
declare const flatpickr: any;
declare const ApexCharts: any;
import * as moment from 'moment';
import { Router } from '@angular/router';
declare const $: any;
declare const sendRespuesta: any;
@Component({
  selector: 'app-administracaja',
  templateUrl: './administracaja.component.html',
  styleUrls: ['./administracaja.component.css']
})
export class AdministracajaComponent implements OnInit {
  @ViewChild('isloading', {static: true}) isloading;
  @ViewChild('isloadingModal', {static: true}) isloadingModal;
  fechaHoy = moment().format('YYYY-MM-DD');
  fechaHasta = moment().add(7, 'days').format('YYYY-MM-DD');
  idUsuario = 2;
  idCaja = 3;
  chartsLengt = false;
  opcionCaja = false;
  years = [] as  any;
  dayxdefault = 0;
  subtotales = {
    montoInicial: '',
    ingresos: '',
    devoluciones: '',
    gastos: '',
  };
  totales = {
    IngresosMostInicial: 0,
    GastosMostDevoluciones: 0,
    total: '',
  };
  filtros = {
    fechaDesde: this.fechaHoy,
    fechaHasta: this.fechaHasta,
    month: 0,
    year : 0,
    idUsuario: this.idUsuario
  };
  caja = {
    idCaja: this.idCaja,
    idUser : this.idUsuario,
    montoApertura: 0,
    status : 'open'
  };
  cargandoInformacion = false;
  constructor(private dynamicScriptLoader: DynamicScriptLoaderService, private cajaSer: CajaService, private router: Router) { }
  estadoCaja = false;
  ngOnInit() {
    this.startScript();
  }
  async startScript() {
    const vm = this;
    vm.ValidarCaja();
    await this.dynamicScriptLoader.load('form.min').then(data => {
      $('.filtroxmes').select2({ width: '100%' }).on('change', (event) => {
        vm.filtros.month = event.target.value;
        vm.filtros.fechaDesde = null;
        vm.filtros.fechaHasta = null;
        vm.filtros.year = 0;
        vm.FetchTotales();
      });
      $('.filtroxyear').select2({ width: '100%' }).on('change', (event) => {
        vm.filtros.year = event.target.value;
        vm.filtros.fechaDesde = null;
        vm.filtros.fechaHasta = null;
        vm.filtros.month = 0;
        vm.FetchTotales();
      });
      flatpickr('.fechaDesde', {
        locale: Spanish,
        defaultDate: [this.fechaHoy]
      });
      flatpickr('.fechaHasta', {
        locale: Spanish,
        defaultDate: [this.fechaHasta]
      });
      vm.YearNow();
      vm.FetchTotales();
      $('[data-toggle="tooltip"]').tooltip();
    }).catch(error => console.log(error));
  }
  FetchTotales() {
    const vm = this;
    vm.chartsLengt = false;
    vm.isloading.showLoading();
    vm.cajaSer.Totales(vm.filtros).then(res => {
       if (vm.filtros.fechaDesde !== null && vm.filtros.fechaHasta !== null) {
         vm.filtros.month = 0;
         vm.filtros.year = 0;
       }
       const rpta = sendRespuesta(res);
       vm.subtotales.montoInicial = rpta.data[3].montoInicial;
       vm.subtotales.ingresos = rpta.data[0].totalIngreso;
       vm.subtotales.gastos = rpta.data[1].totalSalidas;
       vm.subtotales.devoluciones = rpta.data[2].totalDevoluciones;
       vm.totales.IngresosMostInicial = parseFloat(rpta.data[0].totalIngreso) + parseFloat(rpta.data[3].montoInicial);
       vm.totales.GastosMostDevoluciones = parseFloat(rpta.data[1].totalSalidas) + parseFloat(rpta.data[2].totalDevoluciones);
       vm.totales.total = (vm.totales.IngresosMostInicial - vm.totales.GastosMostDevoluciones).toFixed(2);
       vm.chartCaja();
    }).catch((err) => {
      alert(err);
    }).then(() => {
      vm.isloading.closeLoading();
    }, () => {
      alert('ronald');
    });
  }
  private chartCaja() {
    const vm = this;
    $('#chartcaja').remove();
    const montoIncialChart = parseFloat(vm.subtotales.montoInicial).toFixed(2);
    const ingresosChart = parseFloat(vm.subtotales.ingresos).toFixed(2);
    const devolucionesChart = parseFloat(vm.subtotales.devoluciones).toFixed(2);
    const gastosChart = parseFloat(vm.subtotales.gastos).toFixed(2);
    if (+montoIncialChart === 0 && +ingresosChart === 0 && +devolucionesChart === 0 && +gastosChart === 0) {
      vm.chartsLengt = true;
      return false;
    }
    // vm.chart.montoInicial =  parseFloat(vm.subtotales.montoInicial).toFixed(2);
    const options = {
        chart: {
            width: 400,
            type: 'pie',
        },
        labels: ['M.Inicial', 'Ingreso', 'Devolu', 'Salidas'],
        colors: ['rgb(119, 93, 208)' , 'rgb(0, 227, 150)', 'rgb(254, 176, 25)', 'rgb(255, 69, 96)'],
        series: [parseFloat(montoIncialChart), parseFloat(ingresosChart), parseFloat(devolucionesChart), parseFloat(gastosChart)],

       //  series: [parseFloat(montoIncialChart), parseFloat(ingresosChart), parseFloat(devolucionesChart), parseFloat(gastosChart)],
        dataLabels: {
          formatter: function (val, opts) {
              return opts.w.config.series[opts.seriesIndex];
          },
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'right',
                    floating: true
                }
            }
        }]
    };
    $('.chart').append('<div id="chartcaja"></div>');
    const chart = new ApexCharts(
        document.querySelector('#chartcaja'),
        options
    );

    chart.render();

  }
  YearNow() {
    const vm = this;
    vm.years = [];
    const n = (new Date()).getFullYear();
    const d = new Date();
    const m = d.getMonth() + 1;
    const day = d.getDay();
    vm.dayxdefault = day;
    $('.filtroxmes').val(m).trigger('change.select2');
    for (let i = n; i >= 2019; i--) {
      vm.years.push({
        year: i
      });
    }
  }
  Aperturar() {
    const vm = this;
    if (!vm.caja.montoApertura) {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'Monto de apertura requerido',
      });
      return false;
    }
    vm.cargandoInformacion = true;
    vm.isloadingModal.openModal('Aperturando caja');
    vm.cajaSer.Aperturar(this.caja).then(res => {
      const rpta = sendRespuesta(res);
      iziToast.success({
        title: 'OK',
        position: 'topRight',
        message: rpta.message,
      });
    }).catch((err) => {
      console.log('error', err);
    }).then(() => {
      vm.cargandoInformacion = false;
      $('#modalCaja').modal('hide');
      vm.opcionCaja = true;
      vm.estadoCaja = true;
      vm.FetchTotales();
      vm.limpiar();
    }, () => {
      alert('error');
      vm.cargandoInformacion = false;
      this.Close();
    });
  }
  Close() {
      const vm = this;
      $('#modalCaja').modal('hide');
      $('#arqueoCajaDiario').modal('hide');
      vm.isloadingModal.closeModal();
      vm.isloadingModal.closeModal();
  }
  limpiar() {
      const vm = this;
      vm.caja.montoApertura = 0;
      vm.caja.idCaja = vm.idCaja;
      vm.caja.idUser = vm.idUsuario;
  }
  CerrarCaja() {
    const vm = this;
    vm.caja.status = 'close';
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: 'Seguro de cerrar esta caja',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, cerrar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        vm.cajaSer.CerrarCaja(vm.caja).subscribe(res => {
          const rpta = sendRespuesta(res);
          swalWithBootstrapButtons.fire(
            'Cerrada!',
            rpta.message,
            'success');
          this.FetchTotales();
        });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Caja no cerrada :)',
          'error'
          );
      }
    });
  }
  ValidarCaja() {
   const vm = this;
   vm.cajaSer.ValidarCaja(vm.caja).then(res => {
     const rpta = sendRespuesta(res);
     if (rpta.ca_status === 'open') {
      vm.opcionCaja = true;
      vm.estadoCaja = true;
     } else {
      vm.opcionCaja = false;
      vm.estadoCaja = false;
     }
   }).catch((err) => {
    console.log('error', err);
  }).then(() => {
  }, () => {
    console.log('error');
  });
  }
  Arqueo() {
    this.router.navigate(['Caja/Administrar/Arqueo/' + this.idCaja]);
  }
  LimpiarFiltros() {
    const vm = this;
    vm.filtros = {
      fechaDesde: this.fechaHoy,
      fechaHasta: this.fechaHasta,
      month: 0,
      year : 0,
      idUsuario: this.idUsuario
    };
    vm.YearNow();
    vm.FetchTotales();
  }
}
