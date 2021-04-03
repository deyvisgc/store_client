import { Component, OnInit } from '@angular/core';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { CajaService } from '../../service/caja/caja.service';
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import iziToast from 'izitoast';
import swal from 'sweetalert2';
declare const flatpickr: any;
declare const ApexCharts: any;

declare const $: any;
declare const sendRespuesta: any;
@Component({
  selector: 'app-administracaja',
  templateUrl: './administracaja.component.html',
  styleUrls: ['./administracaja.component.css']
})
export class AdministracajaComponent implements OnInit {
  idUsuario = 2;
  sum: any;
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
  constructor(private dynamicScriptLoader: DynamicScriptLoaderService, private cajaSer: CajaService) { }
  estadoCaja = false;
  ngOnInit() {
    this.FetchTotales();
  }
  FetchTotales() {
    const vm = this;
    vm.cajaSer.Totales(vm.idUsuario).then(res => {
      const rpta = sendRespuesta(res);
      console.log(rpta);
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
    }, () => {
      alert('ronald');
    });
  }
  private chartCaja() {
    const vm = this;
    const montoIncialChart = parseFloat(vm.subtotales.montoInicial).toFixed(2);
    const ingresosChart = parseFloat(vm.subtotales.ingresos).toFixed(2);
    const devolucionesChart = parseFloat(vm.subtotales.devoluciones).toFixed(2);
    const gastosChart = parseFloat(vm.subtotales.gastos).toFixed(2);
    // vm.chart.montoInicial =  parseFloat(vm.subtotales.montoInicial).toFixed(2);
    const options = {
        chart: {
            width: 400,
            type: 'pie',
        },
        labels: ['M.Inicial', 'Ingreso', 'Devolu', 'Salidas'],
        colors: ['rgb(119, 93, 208)' , 'rgb(0, 227, 150)', 'rgb(254, 176, 25)', 'rgb(255, 69, 96)'],
        series: [parseFloat(montoIncialChart), parseFloat(ingresosChart), parseFloat(devolucionesChart), parseFloat(gastosChart)],
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

    const chart = new ApexCharts(
        document.querySelector('#chartcaja'),
        options
    );

    chart.render();
}

}
