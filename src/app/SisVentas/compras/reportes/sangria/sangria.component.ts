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
  accion = false;
  @ViewChild('isloading', {static: true}) isloading;
  @ViewChild('isloadingModal', {static: true}) isloadingModal;
  @ViewChild('ingresos', {static: true}) ingresos;
  @ViewChild('salida', {static: true}) salida;
  showTab = 1;

  listIngresos = [];
  listSalidas = [];
  sumaIngresos = 0;
  sumaSalidas = 0;
  sangria = {
    id: 0,
    monto: '',
    fecha: this.fechaHoy,
    tipoSangria: '',
    motivo: '',
    idUsuario: 2,
    idCaja: 3
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
      });
      $('.tipoSangriaFiltro').select2({ width: '100%' }).on('change', (event) => {
        const vm = this;
        vm.sangria.tipoSangria = event.target.value;
      });
      flatpickr('.fechaHoy', {
        locale: Spanish,
        dateFormat: 'Y-m-d',
        defaultDate: [this.fechaHoy]
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
        vm.sangria.idCaja = 3;
        vm.sangria.idUsuario = 2;
        message = 'Registrando Sangria';
      }
      this.isloadingModal.openModal(message);
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
      }).then(() => {
        this.isloadingModal.closeModal();
        this.setearSangia();
      }, () => {
        this.isloadingModal.closeModal();
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
    vm.reporteSer.GetSangria(this.filtros).then( res => {
    vm.sumaIngresos = 0;
    vm.sumaSalidas = 0;
    const rpta = sendRespuesta(res);

    vm.listIngresos = rpta.data.filter( i => i.san_tipo_sangria === 'ingreso');

    vm.listIngresos.map((x, index) => {
      vm.sumaIngresos += vm.listIngresos[index].san_monto;
    });

    vm.listSalidas = rpta.data.filter( e => e.san_tipo_sangria === 'salida');

    vm.listSalidas.map((x, index) => {
      vm.sumaSalidas += vm.listSalidas[index].san_monto;
    });

    vm.ingresos.FetchIngresos(vm.filtros, vm.listIngresos, vm.sumaIngresos.toFixed(2));
    vm.salida.FetchSalidas(vm.filtros, vm.listSalidas, vm.sumaSalidas.toFixed(2));

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
    vm.sangria.fecha = vm.fechaHoy;
    vm.sangria.motivo = '';
    $('.tipoSangria').val(null).trigger('change');
    vm.sangria.idUsuario = 0;
    vm.sangria.idCaja = 0;
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
  }
  Anular(event) {
    const vm = this;
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: 'Seguro de eliminar esta sangria',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        vm.reporteSer.deleteSngria(event).then( res => {
          const rpta = sendRespuesta(res);
          if (rpta.status) {
            swalWithBootstrapButtons.fire(
              'Deleted!',
               rpta.message,
              'success');
            this.Fetch();
          } else {
            swalWithBootstrapButtons.fire(
              'Error!',
              rpta.message,
              'error');
          }
        });
      } else if (
        result.dismiss === swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Tu sangira está a salvo :)',
          'error'
          );
      }
    });
  }
}
