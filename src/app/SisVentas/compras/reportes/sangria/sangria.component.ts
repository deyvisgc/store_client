import { Component, OnInit, ViewChild } from '@angular/core';
import _ from 'lodash';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { ReportesService } from 'src/app/SisVentas/service/reportes/reportes.service';
import * as moment from 'moment';
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import iziToast from 'izitoast';
import swal from 'sweetalert2';
declare const flatpickr: any;

declare const $: any;
declare const sendRespuesta: any;
@Component({
  selector: 'app-sangria',
  templateUrl: './sangria.component.html',
  styleUrls: ['./sangria.component.css']
})
export class SangriaComponent implements OnInit {
  fechaHoy = moment().format('YYYY-MM-DD');
  fechahasta = moment().add(7, 'days').format('YYYY-MM-DD');
  cargandoInformacion = false;
  accion = false;
  @ViewChild('isloading', {static: true}) isloading;
  @ViewChild('isloadingModal', {static: true}) isloadingModal;
  @ViewChild('ingresos', {static: true}) ingresos;
  @ViewChild('salida', {static: true}) salida;
  showTab = 1;
  listIngresos = [];
  listSalidas = [];
  listCaja = [];
  sumaIngresos = 0;
  sumaSalidas = 0;
  idUsuario = 2;
  idCaja = 3;
  sangria = {
    id: 0,
    monto: '',
    fecha: moment().format('YYYY-MM-DD HH:mm'),
    tipoSangria: '',
    motivo: '',
    idUsuario: this.idUsuario,
    idCaja: this.idCaja
  };
  filtros = {
    fechaDesde: this.fechaHoy,
    fechaHasta: this.fechahasta,
    caja: '',
    tipoSangria : ''
  };
  constructor(private dynamicScriptLoader: DynamicScriptLoaderService, private reporteSer: ReportesService) { }

  ngOnInit() {
    this.startScript();
    this.Fetch();
  }
  async startScript() {
    await this.dynamicScriptLoader.load('form.min').then(data => {
      this.showTab = 1;
      $('.tipoSangria').select2({ width: '100%' }).on('change', (event) => {
        const vm = this;
        vm.sangria.tipoSangria = event.target.value;
      });
      $('.caja').select2({ width: '100%' }).on('change', (event) => {
        const vm = this;
        vm.filtros.caja = event.target.value;
        vm.Fetch();
      });
      $('.tipoSangriaFiltro').select2({ width: '100%' }).on('change', (event) => {
        const vm = this;
        vm.filtros.tipoSangria = event.target.value;
        if (vm.filtros.tipoSangria === 'ingreso') {
          vm.showTab = 1;
        }
        if (vm.filtros.tipoSangria === 'salida') {
          vm.showTab = 2;
        }
        vm.Fetch();
      });
      flatpickr('.fechaHoy', {
        locale: Spanish,
        defaultDate: [moment().format('YYYY-MM-DD HH:mm')]
      });
      flatpickr('.fecha_desde', {
        locale: Spanish,
        dateFormat: 'Y-m-d',
        defaultDate: [this.fechaHoy]
      });
      flatpickr('.fecha_hasta', {
        locale: Spanish,
        dateFormat: 'Y-m-d',
        defaultDate: [this.fechahasta]
      });
    }).catch(error => console.log(error));
  }
  Guardar() {
    const vm = this;
    if (vm.Validar()) {
      let message = '';
      if (vm.sangria.id > 0) {
        message = 'Actualizando Sangria';
      } else {
        message = 'Registrando Sangria';
      }
      vm.isloadingModal.openModal(message);
      vm.cargandoInformacion = true;
      vm.reporteSer.AddSangria(vm.sangria).then( res => {
        const rpta = sendRespuesta(res);
        if (rpta.status === true) {
          iziToast.success({
            title: 'OK',
            position: 'topRight',
            message: rpta.message,
          });
          this.Fetch();
        } else {
          iziToast.error({
            title: 'Error',
            position: 'topRight',
            message: rpta.message,
          });
        }
      }).catch((err) => {
        alert(err);
        vm.cargandoInformacion = false;
      }).then(() => {
        this.isloadingModal.closeModal();
        this.setearSangia();
        vm.cargandoInformacion = false;
      }, () => {
        this.isloadingModal.closeModal();
        vm.cargandoInformacion = false;
      });
  }
  }
  Validar() {
    const vm = this;
    if (vm.sangria.monto === '') {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'Monto requerido',
      });
      return false;
    }
    if (vm.sangria.fecha === undefined) {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'Fecha requerido',
      });
      return false;
    }
    if (vm.sangria.tipoSangria === '') {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'Tipo Operacion requerido',
      });
      return false;
    }
    if (vm.sangria.motivo === undefined || vm.sangria.motivo.trim() === '') {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'Motivo requerido',
      });
      return false;
    }
    return true;
  }
  Fetch() {
    const vm = this;
    vm.isloading.showLoading();
    vm.cargandoInformacion = true;
    vm.reporteSer.GetSangria(this.filtros).then( res => {
    vm.sumaIngresos = 0;
    vm.sumaSalidas = 0;
    const rpta = sendRespuesta(res);
    if (rpta.data.caja.length > 0) {
      vm.listCaja = rpta.data.caja;
    }
    vm.listIngresos = rpta.data.lista.filter( i => i.san_tipo_sangria === 'ingreso');

    vm.listIngresos.map((x, index) => {
      vm.sumaIngresos += vm.listIngresos[index].san_monto;
    });

    vm.listSalidas = rpta.data.lista.filter( e => e.san_tipo_sangria === 'salida');

    vm.listSalidas.map((x, index) => {
      vm.sumaSalidas += vm.listSalidas[index].san_monto;
    });

    vm.ingresos.FetchIngresos(vm.listIngresos, vm.sumaIngresos.toFixed(2));
    vm.salida.FetchSalidas(vm.listSalidas, vm.sumaSalidas.toFixed(2));
    vm.isloading.closeLoading();
    vm.cargandoInformacion = false;
    }).catch((err) => {
      console.log(err);
    }).then(() => {
      console.log('finish');
    }, () => {
    });
  }
  setearSangia() {
    const vm = this;
    vm.sangria.monto = '';
    vm.sangria.fecha = moment().format('YYYY-MM-DD HH:mm');
    vm.sangria.motivo = '';
    $('.tipoSangria').val(null).trigger('change');
    vm.sangria.idUsuario = vm.idUsuario;
    vm.sangria.idCaja = vm.idCaja;
  }
  setearFiltros() {
    const vm = this;
    $('.caja').val(null).trigger('change.select2');
    $('.caja').val(null).trigger('change.select2');
    $('.tipoSangriaFiltro').val(null).trigger('change.select2');
    vm.filtros.fechaDesde = vm.fechaHoy;
    vm.filtros.fechaHasta = vm.fechahasta;
  }
  Editar(event) {
    const vm = this;
    vm.accion = true;
    vm.sangria.monto = event.san_monto;
    vm.sangria.fecha = event.san_fecha;
    vm.sangria.tipoSangria = event.san_tipo_sangria;
    vm.sangria.motivo = event.san_motivo;
    vm.sangria.id = event.id_sangria;
    $('.tipoSangria').val(event.san_tipo_sangria).trigger('change');
    iziToast.success({
      title: 'OK',
      position: 'topRight',
      message: 'Informacion Encontrada',
    });
  }
  Actualizar() {
    const vm = this;
    vm.setearSangia();
    vm.setearFiltros();
    vm.showTab = 1;
    vm.accion = false;
    vm.Fetch();
  }
  ExportarExcel() {
    const vm = this;
    vm.cargandoInformacion = true;
    vm.isloading.showLoading();
    vm.reporteSer.ExportarExcelSangria(vm.filtros).subscribe(data => {
      const a          = document.createElement('a');
      document.body.appendChild(a);
      const blob       = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,'});
      const url        = window.URL.createObjectURL(blob);
      a.href         = url;
      a.download     = `Reporte_sangria${((new Date()).getTime())}.xlsx`;
      vm.cargandoInformacion = false;
      vm.isloading.closeLoading();
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
