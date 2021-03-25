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
  fechahasta = moment().add(1, 'months').format('YYYY-MM-DD');
  typelista = this.rutaActiva.snapshot.params.typelista;
  @ViewChild('credito', {static: true}) liscredito;
  @ViewChild('mascomprados', {static: true}) listmostproductbuy;
   params = {
    numeroCompra   : '',
    fechaDesde     : this.fechahoy,
    fechaHasta     :  this.fechahasta,
    codeProveedor  : '',
    tipoPago       : '',
    tipoComprobante: '',
    tabla          : this.typelista
  };
  constructor(private dynamicScriptLoader: DynamicScriptLoaderService,
              private compraserv: CompraService,
              private rutaActiva: ActivatedRoute) {}

  ngOnInit() {
    this.ocultarTable();
    this.Fetch();
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
    if (this.typelista === 'credito') {
      this.liscredito.Listar(vm.params);
    }
  }
  ocultarTable() {
    const vm = this;
    if (vm.typelista === 'credito') {
      $('#credito').show();
      $('#mascomprados').hide();
      return false;
    } else if (vm.typelista === 'productomasvendidos') {
      $('#credito').hide();
      $('#mascomprados').show();
    } else {
      $('#credito').hide();
      $('#mascomprados').hide();
    }
  }
}
