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
  typelista = this.rutaActiva.snapshot.params.id;
  @ViewChild('credito', {static: true}) liscredito;
  @ViewChild('mascomprados', {static: true}) listmostproductbuy;
   params = {
    numeroCompra   : '',
    fechaDesde     : '',
    fechaHasta     :  '',
    codeProveedor  : '',
    tipoPago       : '',
    tipoComprobante: '',
    default        : 1
  };
  constructor(private dynamicScriptLoader: DynamicScriptLoaderService,
              private compraserv: CompraService,
              private rutaActiva: ActivatedRoute) {}

  ngOnInit() {
    this.startScript();
    this.ocularomostrarLista();
    this.typeComponente(this.params);
  }
  async startScript() {
    await this.dynamicScriptLoader.load('form.min').then(data => {
      this.loadData();
    }).catch(error => console.log(error));
  }
  private loadData() {
    const vm = this;
    $('.tipoPago').select2({ width: '100%' }).on('change', (event) => {
      vm.selecTipoPago(event.target.value);
    });
    $('.tipoComprobante').select2({ width: '100%' }).on('change', (event) => {
      vm.selecTipoComprobante(event.target.value);
    });
    $('.Proveedor').select2({ width: '100%' }).on('change', (event) => {
      vm.selecProveedor(event.target.value);
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
  selecTipoComprobante(event: any) {
    this.typeComponente(event);
  }
  selecTipoPago(event: any) {
    this.typeComponente(event);
  }
  selecProveedor(event) {
    this.typeComponente(event);
  }
  typeComponente(params: object) {
    if (this.typelista === '1') {
      this.liscredito.Listar(params);
    }
    if (this.typelista === '2') {
      this.listmostproductbuy.Listar(params);
    }
  }
  ocularomostrarLista() {
    const vm = this;
    switch (vm.typelista) {
      case '1':
        $('#credito').show();
        $('#mascomprados').hide();
        break;
      case '2':
        $('#credito').hide();
        $('#mascomprados').show();
        break;
    }
  }
}
