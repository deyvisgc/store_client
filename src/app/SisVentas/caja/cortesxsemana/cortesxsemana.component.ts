import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Spanish } from 'flatpickr/dist/l10n/es.js';
declare const $: any;
declare const sendRespuesta: any;
declare const flatpickr: any;
import _ from 'lodash';
import iziToast from 'izitoast';
import * as moment from 'moment';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { CajaService } from 'src/app/SisVentas/service/caja/caja.service';
@Component({
  selector: 'app-cortesxsemana',
  templateUrl: './cortesxsemana.component.html',
  styleUrls: ['./cortesxsemana.component.css']
})
export class CortesxsemanaComponent implements OnInit {
  totalEntregarSemanal = '';
  cargandoInformacion = true;
  fechaHasta = moment().format('YYYY-MM-DD HH:mm');
  fechaDesde = moment().subtract(4, 'd').format('YYYY-MM-DD');
  horaActual = moment().format('HH:mm');
  horaTermino = moment().add(7, 'hour').format('HH:mm');
  @ViewChild('isloadingModal', {static: true}) isloadingModal;
  btnguardar = true;
  lunes = [];
  martes = [];
  miercoles = [];
  jueves = [];
  idCortes = [];
  corteSemanalTotales = {
    saldoInicio : 0,
    totalCobrado : 0,
    totalEntregado: 0,
    totalEntregarSemanal: 0,
    totalMonedas: 0,
    totalBilletes: 0,
    fecha: this.fechaHasta,
    horaInicio : this.horaActual,
    horaTermino: this.horaTermino,
    idCaja: this.rutaActiva.snapshot.params.idCaja,
  };
  CorteSemanalObj = {
    monedas: [],
    billetes: [],
    fechaInicio: this.fechaDesde,
    fechaTermino: this.fechaHasta,
    corteSemanal: true
  };
  constructor(private dynamicScriptLoader: DynamicScriptLoaderService,
              private cajaSer: CajaService, private rutaActiva: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.startScript();
  }
  async startScript() {
    const vm = this;
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    });
    await this.dynamicScriptLoader.load('form.min').then(data => {
      flatpickr('.fechaDesde', {
        locale: Spanish,
        defaultDate: [this.fechaDesde]
      });
      flatpickr('.fechaHoy', {
        locale: Spanish,
        defaultDate: [this.fechaHasta]
      });
      flatpickr('.fechaHasta', {
        locale: Spanish,
        defaultDate: [this.fechaHasta]
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
    }).catch(error => console.log(error));
  }
  SearchCortes() {
    const vm = this;
    const fechas = {
      fechaDesde : vm.fechaDesde,
      fechaHasta : vm.fechaHasta
    };
    vm.cajaSer.BuscarcortesXFechas(fechas).then(res => {
      const dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
      const rpta = sendRespuesta(res);
      rpta.data.forEach((element, index) => {
        const date  = new Date(rpta.data[index].fecha_corte);
        // const fechaNum = date.getUTCDate();
        rpta.data[index].diaSemana = dias[date.getDay()];
        rpta.data[index].totales = Number(element.dcc_total);
      });
      // const idrecotres = _.uniq(vm.idCortes);
      // vm.CorteSemanalObj.idCajaCorte = idrecotres;
      const lunes = rpta.data.filter(l => l.diaSemana === 'Lunes');
      const martes = rpta.data.filter(l => l.diaSemana === 'Martes');
      const miercoles = rpta.data.filter(l => l.diaSemana === 'Miercoles');
      const jueves = rpta.data.filter(l => l.diaSemana === 'Jueves');
      vm.cajaSer.obtenerCorteLunes(lunes);
      vm.cajaSer.obtenerCorteMartes(martes);
      vm.cajaSer.obtenerCorteMiercoles(miercoles);
      vm.cajaSer.obtenerCorteJueves(jueves);
      // agrego los arrays del lunes a jueves
      vm.lunes = lunes;
      vm.martes = martes;
      vm.miercoles = miercoles;
      vm.jueves = jueves;
      iziToast.success({
        title: 'OK',
        position: 'topRight',
        message: 'Cortes diario  de la semana encontrado',
      });
    }).catch((err) => {
      console.log(err);
    }).then(() => {
      console.log('entro');
    });
  }
  SumarTotales(totalViernes) {
    const vm = this;
    if (vm.lunes.length === 0 && vm.martes.length === 0 && vm.miercoles.length === 0 && vm.jueves.length === 0) {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'Se necesita los totales de dias anteriores para hacer la suma.',
      });
      return false;
    }
    const totalMonedas = _.sumBy(vm.lunes, function(o) {
      if (o.dcc_type_money === 1) {
        return o.totales;
      }
    });
    const totalBilletes = _.sumBy(vm.lunes, function(o) {
      if (o.dcc_type_money === 2) {
        return o.totales;
      }
    });
    // martes
    const totalMonedasMartes = _.sumBy(vm.martes, function(o) {
      if (o.dcc_type_money === 1) {
        return o.totales;
      }
    });
    const totalBilletesMartes = _.sumBy(vm.martes, function(o) {
      if (o.dcc_type_money === 2) {
        return o.totales;
      }
    });
    // miercoles
    const totalMonedasMiercoles = _.sumBy(vm.miercoles, function(o) {
      if (o.dcc_type_money === 1) {
        return o.totales;
      }
    });
    const totalBilletesMiercoles = _.sumBy(vm.miercoles, function(o) {
      if (o.dcc_type_money === 2) {
        return o.totales;
      }
    });
    // jueves
    const totalMonedasJueves = _.sumBy(vm.jueves, function(o) {
      if (o.dcc_type_money === 1) {
        return o.totales;
      }
    });
    const totalBilletesJueves = _.sumBy(vm.jueves, function(o) {
      if (o.dcc_type_money === 2) {
        return o.totales;
      }
    });
    const totalLunes = totalMonedas + totalBilletes;
    const totalMartes = totalMonedasMartes + totalBilletesMartes;
    const totalMiercoles = totalMonedasMiercoles + totalBilletesMiercoles;
    const totalJueves = totalMonedasJueves + totalBilletesJueves;
    vm.totalEntregarSemanal = Number(totalLunes + totalMartes + totalMiercoles + totalJueves + Number(totalViernes)).toFixed(2);
    return true;
  }
  corteSemanal(data) {
    const vm = this;
    const status = vm.SumarTotales(data.montoTotalIngresado);
    if (status) {
    const monedas = data.monedas.filter(m => m.cantidad !== 0 && m.subtotal !== 0);
    const billetes = data.billetes.filter(b => b.cantidad !== 0 && b.subtotal !== 0);
    vm.CorteSemanalObj.monedas = monedas;
    vm.CorteSemanalObj.billetes = billetes;
    vm.corteSemanalTotales.saldoInicio = data.saldoInicial;
    vm.corteSemanalTotales.totalCobrado = data.totalCobrado;
    vm.corteSemanalTotales.totalEntregado = data.montoTotalIngresado;
    vm.corteSemanalTotales.totalMonedas = data.totalMonedas;
    vm.corteSemanalTotales.totalBilletes = data.totalBilletes;
    vm.corteSemanalTotales.totalEntregarSemanal = Number(vm.totalEntregarSemanal);
    vm.btnguardar = false;
    iziToast.success({
      title: 'OK',
      position: 'topRight',
      message: 'Montos totales sumados Correctamente',
    });
    }
  }
  Guardar() {
    const vm = this;
    if (vm.lunes.length === 0 && vm.martes.length === 0 && vm.miercoles.length === 0 && vm.jueves.length === 0) {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'Totales de los dias anteriores requeridos.',
      });
      return false;
    }
    vm.isloadingModal.openModal('Guardando corte de caja semana');
    vm.cajaSer.GuardarCorteSemanal(this.CorteSemanalObj, vm.corteSemanalTotales).then(res => {
      const rpta = sendRespuesta(res);
      if (rpta.status) {
        iziToast.success({
          title: 'OK',
          position: 'topRight',
          message: rpta.message,
        });
        vm.removeLocalStorage();
        vm.cajaSer.obtenerCorteViernes(true);
        vm.vacearArrayxSemana();
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
    return;
  }
  removeLocalStorage() {
    localStorage.removeItem('monedas');
    localStorage.removeItem('billetes');
    localStorage.removeItem('totalBilletes');
    localStorage.removeItem('totalMonedas');
    localStorage.removeItem('totalCobrado');
    localStorage.removeItem('totalAentregar');
    this.totalEntregarSemanal = '';
    this.corteSemanalTotales.fecha = this.fechaHasta;
    this.corteSemanalTotales.horaInicio = this.horaActual;
    this.corteSemanalTotales.horaTermino = this.horaTermino;
  }
  existIdCaja(data) {
    iziToast.error({
      title: 'Error',
      position: 'topRight',
      message: data.message,
    });
    this.cargandoInformacion = false;
  }
  volveracaja() {
    this.router.navigate(['Caja/Administrar']);
  }
  vacearArrayxSemana() {
    const vm = this;
    vm.lunes = [];
    vm.martes = [];
    vm.miercoles = [];
    vm.jueves = [];
    vm.cajaSer.obtenerCorteLunes([]);
    vm.cajaSer.obtenerCorteMartes([]);
    vm.cajaSer.obtenerCorteMiercoles([]);
    vm.cajaSer.obtenerCorteJueves([]);
  }
}
