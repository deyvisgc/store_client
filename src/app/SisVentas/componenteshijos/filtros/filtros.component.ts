import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import * as moment from 'moment';
import iziToast from 'izitoast';
declare const $: any;
import { ProductoService } from '../../service/Almacen/producto/producto.service';
@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.css']
})
export class FiltrosComponent implements OnInit {
  @Output() filtroCategoria = new EventEmitter<any>();
  @Output() filtroUnidadMedida = new EventEmitter<any>();
  @Output() filtroRangoFecha = new EventEmitter<any>();
  @Output() Reload = new EventEmitter<any>();
  @Output() Limpiar = new EventEmitter<any>();
  @Output() isExport = new EventEmitter<any>();
  desde = moment().format('YYYY-MM-DD');
  hasta = moment().add(1, 'months').format('YYYY-MM-DD');
  categoria = '';
  unidadMedida = '';
  isloadingCategoria: boolean;
  isloadingUnidadMedida: boolean;
  isLoading = false;
  constructor(private productSer: ProductoService) { }

  ngOnInit() {
    window.addEventListener('keyup', e => {
      const vm = this;
      if (e.keyCode === 27) {
        vm.isloadingCategoria = false;
        vm.isloadingUnidadMedida = false;
      }
    });
  }
  fetch() {
   const vm = this;
   if (!vm.categoria) {
     vm.filtroCategoria.emit([]);
   }
   if (!vm.unidadMedida) {
    vm.filtroUnidadMedida.emit([]);
   }
  }
  showSelectCategoria() {
    const vm = this;
    vm.isloadingCategoria = true;
  }
  showSelectUnidaMedida() {
    const vm = this;
    vm.isloadingUnidadMedida = true;
  }
  selectCategoria(event) {
    const vm = this;
    vm.categoria = event.clas_name;
    vm.isloadingCategoria = false;
    vm.filtroCategoria.emit(event);
  }
  selectUnidad(event) {
    const vm = this;
    vm.unidadMedida = event.um_name;
    vm.isloadingUnidadMedida = false;
    vm.filtroUnidadMedida.emit(event);
  }
  Search() {
    const vm = this;
    const fechas = {
      desde: vm.desde,
      hasta: vm.hasta
    };
    if (vm.desde > vm.hasta) {
      alert('la fecha desde debe ser menor a la fecha hasta');
    } else {
      vm.filtroRangoFecha.emit(fechas);
    }
    vm.isLoading = true;
  }
  Actualizar() {
    const vm = this;
    vm.isLoading = true;
    vm.Reload.emit(true);
  }
  LimpiarFiltros() {
    const vm = this;
    vm.categoria = '';
    vm.unidadMedida = '';
    vm.isLoading = true;
    vm.Limpiar.emit(true);
  }
  isLoadingTrue() {
    const vm = this;
    vm.isLoading = false;
    $('#modalExportar').modal('hide');
  }
  Exportar(opcion) {
    const vm = this;
    vm.isLoading = true;
    vm.isExport.emit(opcion);
  }
}
