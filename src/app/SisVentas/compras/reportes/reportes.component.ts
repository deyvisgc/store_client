import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { CompraService } from '../../service/compras/compra.service';
import { Spanish } from 'flatpickr/dist/l10n/es.js';
declare const $: any;
declare const sendRespuesta: any;
declare const flatpickr: any;
@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})

export class ReportesComponent implements OnInit {
  proveedor: any = [];
  fechahoy = moment().format('YYYY-MM-DD');
  cargandoInformacion = false;
  comprasVigentes: any = [];
  comprasAnuladas: any = [];
  comprasCredito: any = [];
  comprasContado: any = [];
  fechahasta = moment().add(1, 'months').format('YYYY-MM-DD');
  typelista = this.rutaActiva.snapshot.params.typelista;
  @ViewChild('vigentes', {static: true}) vigentes;
  @ViewChild('anuladas', {static: true}) anuladas;
  @ViewChild('contado', {static: true}) contado;
  @ViewChild('credito', {static: true}) credito;
   params = {
    numeroCompra   : '',
    fechaDesde     : this.fechahoy,
    fechaHasta     :  this.fechahasta,
    codeProveedor  : '',
    tipoPago       : '',
    tipoComprobante: '',
    tabla          : 'vigente'
  };
  constructor(private dynamicScriptLoader: DynamicScriptLoaderService,
              private compraserv: CompraService,
              private rutaActiva: ActivatedRoute) {}

  ngOnInit() {
    this.Fetch();
    this.SendData();
    this.startScript();
  }
  async startScript() {
    await this.dynamicScriptLoader.load('form.min').then(data => {
      this.loadData();
    }).catch(error => console.log(error));
  }
  private loadData() {
    const vm = this;
    $('.tipoPago').select2({ width: '100%' }).on('change', (event) => {
      vm.params.tipoPago = event.target.value;
      vm.Fetch();
    });
    $('.tipoComprobante').select2({ width: '100%' }).on('change', (event) => {
      vm.params.tipoComprobante = event.target.value;
      vm.Fetch();
    });
    $('.Proveedor').select2({ width: '100%' }).on('change', (event) => {
      vm.params.codeProveedor = event.target.value;
      vm.Fetch();
    });
    vm.compraserv.SearchProveedor().subscribe((res: any = []) => {
      vm.proveedor = res;
    });
    flatpickr('.fecha_desde', {
      locale: Spanish,
      dateFormat: 'Y-m-d',
      defaultDate: [this.fechahoy]
    });
    flatpickr('.fecha_hasta', {
      locale: Spanish,
      dateFormat: 'Y-m-d',
      defaultDate: [this.fechahasta]
    });
  }
  Fetch() {
    const vm = this;
    vm.vigentes.FetchVigentes(vm.params);
  }
  FetchActualzar() {
    const vm = this;
    vm.LinpiarArray();
    vm.Fetch();
  }
  LimpiarFiltros() {
    const vm = this;
    vm.LinpiarArray();
    vm.Fetch();
  }
  LinpiarArray() {
    const vm = this;
    vm.params.codeProveedor = '';
    vm.params.fechaDesde = vm.fechahoy;
    vm.params.fechaHasta = vm.fechahasta;
    vm.params.tabla = vm.typelista;
    vm.params.tipoComprobante = '';
    vm.params.tipoPago = '';
    $('#proveedor').val(null).trigger('change');
    $('.tipoPago').val(null).trigger('change');
    $('.tipoComprobante').val(null).trigger('change');
    vm.Fetch();
  }
  Exportar() {
    const vm = this;
    vm.cargandoInformacion = true;
    vm.compraserv.DowloadExcel(vm.params).subscribe(data => {
      const a          = document.createElement('a');
      document.body.appendChild(a);
      const blob       = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,'})
      const url        = window.URL.createObjectURL(blob);
      a.href         = url;
      a.download     = `Reporte_Compras_credito${((new Date()).getTime())}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      vm.cargandoInformacion = false;
    });
  }
  SendData() {
    const vm = this;
    vm.compraserv.Compra$.subscribe(data => {
       vm.comprasVigentes = data[0];
       vm.comprasAnuladas = data[1];
       vm.comprasCredito  = data[2];
       vm.comprasContado  = data[3];
       vm.SendInformacion();
  });
  }
  SendInformacion() {
   const vm = this;
   vm.anuladas.FetchAnuladas(vm.comprasAnuladas, vm.params);
   vm.contado.FetchContado(vm.comprasContado, vm.params);
   vm.credito.FetchCredito(vm.comprasCredito, vm.params);
  }
}
