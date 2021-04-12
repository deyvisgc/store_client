import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import _ from 'lodash';
import * as moment from 'moment';
import iziToast from 'izitoast';
declare const $: any;
declare const sendRespuesta: any;
declare const flatpickr: any;
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { CajaService } from '../../service/caja/caja.service';
import { numericIndexGetter } from '@swimlane/ngx-datatable/release/utils';
@Component({
  selector: 'app-arqueocaja',
  templateUrl: './arqueocaja.component.html',
  styleUrls: ['./arqueocaja.component.css']
})
export class ArqueocajaComponent implements OnInit {
  btnguardar = true;
  @ViewChild('isloadingModal', {static: true}) isloadingModal;
  @ViewChild('reloadFiltros', {static: true}) reloadFiltros;
  fechaHoy = moment().format('YYYY-MM-DD HH:mm');
  horaActual = moment().format('HH:mm');
  statusArqueo = 0;
  arqueoCaja = {
    empresa: '',
    fecha: this.fechaHoy,
    hora: this.horaActual,
    idCaja: this.rutaActiva.snapshot.params.idCaja,
    totalMonedas: '',
    totalBilletes: '',
    cajaApertura: '',
    totalVenta: '',
    totalCorte: '',
    faltantes: '',
    sobrantes: '',
    observaciones: ''
  };
  constructor(private router: Router, private rutaActiva: ActivatedRoute,
              private dynamicScriptLoader: DynamicScriptLoaderService,
              private cajaServ: CajaService) { }

  ngOnInit() {
   this.activarToltip();
  }
  async startScript() {
    const vm = this;
    await this.dynamicScriptLoader.load('form.min').then(data => {
      flatpickr('.fechaHoy', {
        locale: Spanish,
        dateFormat: 'Y-m-d',
        defaultDate: [this.fechaHoy]
      });
      flatpickr('.horaActual', {
        dateFormat: 'H:i',
        enableTime: true,
        allowInput: true,
        noCalendar: true,
        defaultDate : [this.horaActual]
      });
    }).catch(error => console.log(error));
  }
  calcular() {
    const vm = this;
    const params = {
      idCaja: vm.arqueoCaja.idCaja,
      fecha: vm.arqueoCaja.fecha
    };
    // vm.isloadingModal.openModal('Calculando arqueo de caja');
    vm.reloadFiltros.showLoading();
    vm.cajaServ.ObtenerTotalesArqueo(params).then(res => {
      const rpta = sendRespuesta(res);
      vm.arqueoCaja.totalMonedas =  rpta.data.Corte.total_monedas;
      vm.arqueoCaja.totalBilletes =  rpta.data.Corte.total_billetes;
      vm.arqueoCaja.cajaApertura =  rpta.data.Corte.monto_inicial;
      vm.arqueoCaja.totalVenta =  parseFloat(rpta.data.totalVenta).toFixed(2);
      vm.arqueoCaja.totalCorte = parseFloat(rpta.data.totalCorte).toFixed(2);
      const totalDiferencia = (Number(vm.arqueoCaja.totalVenta) - Number(vm.arqueoCaja.totalCorte));
      if (totalDiferencia === 0) {
        vm.statusArqueo = 1;
        return false;
      }
      const status = Math.sign(totalDiferencia);
      if (status === -1) {
           vm.statusArqueo = 2;
           const numbernegativo = Number(totalDiferencia);
           vm.arqueoCaja.faltantes = Math.abs(numbernegativo).toFixed(2) ;
           return;
      }
      if (status === 1) {
        vm.statusArqueo = 3;
        vm.arqueoCaja.sobrantes = Number(totalDiferencia).toFixed(2);
        return;
      }
    }).catch((err) => {
      console.log(err);
    }).then(() => {
      vm.btnguardar = false;
      vm.reloadFiltros.closeLoading();
    });
  }
  activarToltip() {
    $('[data-toggle="tooltip"]').tooltip();
  }
  desactivarToltip() {
    $('[data-toggle="tooltip"]').tooltip('dispose');
  }
  guardar() {
    const vm = this;
    if (+vm.arqueoCaja.totalVenta > 0 && +vm.arqueoCaja.totalCorte > 0) {
      vm.isloadingModal.openModal('Guardando Arqueo');
      vm.cajaServ.GuardarArqueo(vm.arqueoCaja).then(res => {
        const rpta = sendRespuesta(res);
        iziToast.success({
          title: 'OK',
          position: 'topRight',
          message: rpta.message,
        });
        vm.limpiar();
      }).catch((err) => {
        console.log(err);
      }).then(() => {
        vm.isloadingModal.closeModal();
      });
    } else {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'se necesita todos los totales para guardar el arqueo de caja',
      });
    }
  }
  limpiar() {
    const vm = this;
    vm.arqueoCaja = {
      empresa: '',
      fecha: this.fechaHoy,
      hora: this.horaActual,
      idCaja: this.rutaActiva.snapshot.params.idCaja,
      totalMonedas: '',
      totalBilletes: '',
      cajaApertura: '',
      totalVenta: '',
      totalCorte: '',
      faltantes: '',
      sobrantes: '',
      observaciones: ''
    };
    vm.statusArqueo = 0;
    vm.btnguardar = true;
  }
}
