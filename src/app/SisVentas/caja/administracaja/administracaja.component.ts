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
import _ from 'lodash';
@Component({
  selector: 'app-administracaja',
  templateUrl: './administracaja.component.html',
  styleUrls: ['./administracaja.component.css']
})
export class AdministracajaComponent implements OnInit {
  @ViewChild('isloading', {static: true}) isloading;
  @ViewChild('isloadingModal', {static: true}) isloadingModal;
  fechaHoy = moment().format('YYYY-MM-DD');
  descripcion = '';
  fechaDesde = '';
  fechaHasta = '';
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
    fechaDesde: '',
    fechaHasta: '',
    idCaja: this.idCaja,
    idUsuario: this.idUsuario
  };
  caja = {
    idCaja: this.idCaja,
    idUser : this.idUsuario,
    montoApertura: 0,
    status : 'open'
  };
  lunes = [];
  martes = [];
  miercoles = [];
  jueves = [];
  viernes = [];
  sabado = [];
  domingo = [];

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
      const diasemana = vm.weekDate(new Date());
      vm.fechaDesde = diasemana[0];
      vm.fechaHasta = diasemana[6];
      flatpickr('.fechaDesde', {
        locale: Spanish,
        dateFormat: 'd-m-Y',
        defaultDate: [this.fechaDesde]
      });
      flatpickr('.fechaHasta', {
        locale: Spanish,
        dateFormat: 'd-m-Y',
        defaultDate: [this.fechaHasta]
      });
      vm.FetchTotales();
      vm.FechTotalCorte();
      $('[data-toggle="tooltip"]').tooltip();
    }).catch(error => console.log(error));
  }
  FetchTotales() {
    const vm = this;
    console.log(vm.filtros);
    vm.chartsLengt = false;
    vm.isloading.showLoading();
    vm.cajaSer.Totales(vm.filtros).then(res => {
       const rpta = sendRespuesta(res);
       if (rpta.status) {
        vm.descripcion = rpta.message;
        vm.subtotales.montoInicial = rpta.data[0].montoInicial || 0;
        vm.subtotales.ingresos = rpta.data[1].totalIngreso || 0;
        vm.subtotales.gastos = rpta.data[2].totalSalidas || 0;
        vm.subtotales.devoluciones = rpta.data[3].totalDevoluciones || 0;
        vm.totales.IngresosMostInicial = parseFloat(rpta.data[1].totalIngreso) + parseFloat(rpta.data[0].montoInicial) || 0;
        vm.totales.GastosMostDevoluciones = parseFloat(rpta.data[2].totalSalidas) + parseFloat(rpta.data[3].totalDevoluciones) || 0;
        vm.totales.total = (vm.totales.IngresosMostInicial - vm.totales.GastosMostDevoluciones).toFixed(2) || '0';
        vm.chartCaja();
       } else {
        iziToast.error({
          title: 'Error',
          position: 'topRight',
          message: rpta.message,
        });
       }
    }).catch((err) => {
      console.log(err);
    }).then(() => {
      vm.isloading.closeLoading();
    }, () => {
      alert('ronald');
    });
  }
  FechTotalCorte() {
    const vm = this;
    if (vm.filtros.idCaja === 0) {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'el numero caja debe ser mayor a 0',
      });
      return false;
    }
    vm.filtros.fechaDesde = vm.fechaDesde;
    vm.filtros.fechaHasta = vm.fechaHasta;
    vm.cajaSer.FetchTotalesCorte(vm.filtros).then( res => {
      const rpta = sendRespuesta(res);
      if (rpta.status) {
        if (rpta.data.length > 0) {
          const dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
          const diasemanas = vm.weekDate(new Date());
          rpta.data.forEach((element, index) => {
            const date  = new Date(rpta.data[index].fecha_corte);
            rpta.data[index].diaSemana = dias[date.getDay()];
            vm.lunes = rpta.data.filter(l => l.diaSemana === 'Lunes');
            vm.martes = rpta.data.filter(l => l.diaSemana === 'Martes');
            vm.miercoles = rpta.data.filter(l => l.diaSemana === 'Miercoles');
            vm.jueves = rpta.data.filter(l => l.diaSemana === 'Jueves');
            vm.viernes = rpta.data.filter(l => l.diaSemana === 'Viernes');
            vm.sabado = rpta.data.filter(l => l.diaSemana === 'Sabado');
            vm.domingo = rpta.data.filter(l => l.diaSemana === 'Domingo');
          });
          vm.datatable(rpta.data, '.table-corte');
          vm.chartCortes(diasemanas);
          return true;
        }
        iziToast.warning({
          title: 'Upss',
          position: 'topRight',
          message: 'No se encontraron registro para este rango de fechas',
        });
      }
      console.log(res);
    }).catch((err) => {

    }). then(() => {

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
  private chartCortes(diasemana) {
    const vm = this;
    const totalMonedasLunes     = vm.lunes.length     === 0 ? 0 : Number(this.lunes[0].total_monedas);
    const totalMonedasMartes    = vm.martes.length    === 0 ? 0 : Number(this.martes[0].total_monedas);
    const totalMonedasMiercoles = vm.miercoles.length === 0 ? 0 : Number(this.miercoles[0].total_monedas);
    const totalMonedasJueves    = vm.jueves.length    === 0 ? 0 : Number(this.jueves[0].total_monedas);
    const totalMonedasViernes   = vm.viernes.length   === 0 ? 0 : Number(this.viernes[0].total_monedas);
    const totalMonedasSabado    = vm.sabado.length    === 0 ? 0 : Number(this.sabado[0].total_monedas);
    const totalMonedasDomingo   = vm.domingo.length   === 0 ? 0 : Number(this.domingo[0].total_monedas);
    console.log(totalMonedasLunes);

    const totalBilletesLunes     = vm.lunes.length === 0 ? 0 : Number(this.lunes[0].total_billetes);
    console.log(totalBilletesLunes);
    const totalBilletesMartes    = vm.martes.length    === 0 ? 0 : Number(this.martes[0].total_billetes);
    const totalBilletesMiercoles = vm.miercoles.length === 0 ? 0 : Number(this.miercoles[0].total_billetes);
    const totalBilletesJueves    = vm.jueves.length    === 0 ? 0 : Number(this.jueves[0].total_billetes);
    const totalBilletesViernes   =  vm.viernes.length  === 0 ? 0 : Number(this.viernes[0].total_billetes);
    const totalBilletesSabado    =   vm.sabado.length  === 0 ? 0 : Number(this.sabado[0].total_billetes);
    const totalBilletesDomingo   =  vm.domingo.length  === 0 ? 0 : Number(this.domingo[0].total_billetes);

    const totalGananciasLunes     =  vm.lunes.length    === 0 ? 0 : Number(this.lunes[0].ganancias_x_dia);
    console.log(totalGananciasLunes);
    const totalGananciasMartes    =  vm.martes.length   === 0 ? 0 : Number(this.martes[0].ganancias_x_dia);
    const totalGananciasMiercoles = vm.miercoles.length === 0 ? 0 : Number(this.miercoles[0].ganancias_x_dia);
    const totalGananciasJueves    =  vm.jueves.length   === 0 ? 0 : Number(this.jueves[0].ganancias_x_dia);
    const totalGananciasViernes   =  vm.viernes.length  === 0 ? 0 : Number(this.viernes[0].ganancias_x_dia);
    const totalGananciasSabado    =   vm.sabado.length  === 0 ? 0 : Number(this.sabado[0].ganancias_x_dia);
    const totalGananciasDomingo   =  vm.domingo.length  === 0 ? 0 : Number(this.domingo[0].ganancias_x_dia);


    const totalEntregadoLunes     =  vm.lunes.length     === 0 ? 0 : Number(this.lunes[0].monto_entregado_dia);
    const totalEntregadoMartes    =  vm.martes.length    === 0 ? 0 : Number(this.martes[0].monto_entregado_dia);
    const totalEntregadoMiercoles =  vm.miercoles.length === 0 ? 0 : Number(this.miercoles[0].monto_entregado_dia);
    const totalEntregadoJueves    =  vm.jueves.length    === 0 ? 0 : Number(this.jueves[0].monto_entregado_dia);
    const totalEntregadoViernes   =  vm.viernes.length   === 0 ? 0 : Number(this.viernes[0].monto_entregado_dia);
    const totalEntregadoSabado    =  vm.sabado.length    === 0 ? 0 : Number(this.sabado[0].monto_entregado_dia);
    const totalEntregadoDomingo   =  vm.domingo.length   === 0 ? 0 : Number(this.domingo[0].monto_entregado_dia);
    console.log(totalEntregadoLunes);
    const options = {
      series: [{
      name: 'Efectivo en Monedas',
      data: [totalMonedasLunes, totalMonedasMartes, totalMonedasMiercoles,
             totalMonedasJueves, totalMonedasViernes, totalMonedasSabado,
             totalMonedasDomingo
            ]
    }, {
      name: 'Efectivo en billetes',
      data: [totalBilletesLunes, totalBilletesMartes, totalBilletesMiercoles,
             totalBilletesJueves, totalBilletesViernes, totalBilletesSabado,
             totalBilletesDomingo
            ]
    }, {
      name: 'Total Ganancia',
      data: [totalGananciasLunes, totalGananciasMartes, totalGananciasMiercoles,
             totalGananciasJueves, totalGananciasViernes, totalGananciasSabado,
             totalGananciasDomingo
            ]
    }, {
      name: 'Total entregado',
      data: [totalEntregadoLunes, totalEntregadoMartes, totalEntregadoMiercoles,
             totalEntregadoJueves, totalEntregadoViernes, totalEntregadoSabado,
             totalEntregadoDomingo
            ]
    }],
      chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: {
        show: true
      },
      zoom: {
        enabled: true
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: '180%',
      },
    },
    stroke: {
      width: 1,
      colors: ['#fff']
    },
    xaxis: {
      categories: [diasemana[0], diasemana[1], diasemana[2], diasemana[3], diasemana[4], diasemana[5], diasemana[6]],
      labels: {
        formatter: function (val) {
          return 'S/. ' + val;
        }
      }
    },
    yaxis: {
      title: {
        text: undefined
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return 'S/. ' + val;
        }
      }
    },
    fill: {
      opacity: 1
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      offsetX: 40
    }
    };

    var chart = new ApexCharts(document.querySelector("#chart8"), options);
    chart.render();
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
  FiltrarXFechas() {
    const vm = this;
    vm.filtros.fechaDesde = vm.fechaDesde;
    vm.filtros.fechaHasta = vm.fechaHasta;
    vm.FetchTotales();
  }
  LimpiarFiltros() {
    const vm = this;
    vm.filtros = {
      fechaDesde: this.fechaDesde,
      fechaHasta: this.fechaHasta,
      idCaja : this.idCaja,
      idUsuario: this.idUsuario
    };
    vm.FetchTotales();
  }
   weekDate(current) {
    const week = [];
    const weekFormat = [];
    if (current.getDay() === 0) {//En los casos en que es domingo, restar como si fuera septimo dia y no cero
        current.setDate(((current.getDate() - 7) + 1));
    } else {
        current.setDate(((current.getDate() - current.getDay()) + 1));
    }
    for (let i = 0; i < 7; i++) {
        week.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }
    week.forEach((w) => {
        weekFormat.push(moment(w).format('DD-MM-YYYY'));
    });
    return weekFormat;
  }
  datatable(datos, table) {
    $(table).DataTable({
      "lengthMenu": [[10, 20, 50], [10, 20, 50]],
      data: datos,
      columns: [
      { data: 'fecha_corte'},
      {data:  'total_monedas' },
      {data:  'total_billetes'},
      {data: 'ganancias_x_dia'},
      {data: 'monto_entregado_dia'},
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
          // vm.Editar(data);
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
}
