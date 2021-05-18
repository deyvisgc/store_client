import { Component, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import iziToast from 'izitoast';
@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.css']
})
export class FiltrosComponent implements OnInit {
  @Output() filtro = new EventEmitter<any>();
  categoria = '';
  lote = '';
  unidadMedida = '';
  isloadingCategoria: boolean;
  isloadingLote: boolean;
  isloadingUnidadMedida: boolean;
  constructor() { }

  ngOnInit() {
    window.addEventListener('keyup', e => {
      const vm = this;
      if (e.keyCode === 27) {
        vm.isloadingCategoria = false;
        vm.isloadingLote = false;
        vm.isloadingUnidadMedida = false;
      }
    });
  }
//   private loadData() {
//     this.select();
//     // this.desactiviarOrDesactivar(1);
//     $('#loteseach').select2().on('change', (event) => {
//        this.searchxType(event.target.value, 'lote');
//     });
//     $('#claseseach').select2().on('change', (event) => {
//       this.searchxType(event.target.value, 'clase');
//    });
//     $('#unidadseacrh').select2().on('change', (event) => {
//     this.searchxType(event.target.value, 'unidad');
//     });
//         // this.select2();
//   }
//   async startScript() {
//     await this.dynamicScriptLoader.load('form.min').then(data => {
//       this.loadData();
//     }).catch(error => console.log(error));
//   }
//    searchxType(event, searctype) {
//     const data = [{
//       typesearch : searctype,
//       id : event
//     }];
//     // this.loading = true;
//     this.almacenServ.SearchxType(data).subscribe((resp: any = []) => {
//      if (resp.length > 0) {
//       //  this.loading = false;
//        iziToast.success({
//          title: 'Succes',
//          position: 'topRight',
//          message: 'productos encontrados',
//        });
//        this.searchtselect.emit(resp);
//      } else {
//       //  this.loading = false;
//        iziToast.error({
//          title: 'Error',
//          message: 'productos no encontrados',
//         });
//        this.searchtselect.emit(resp);
//      }
//     });
//   }
//   public select() {
//     this.almacenServ.Lote().subscribe(res => {
//       this.lote1 = res;
//       console.log(this.lote1);
//     });
//     this.almacenServ.UnidadMedida().subscribe(resp => {
//       this.unidad1 = resp;
//       console.log(this.unidad1);
//     });
//     this.almacenServ.getClaseSupe().subscribe(respcla => {
//       this.clase1 = respcla;
//       console.log(this.clase1);
//     });
//   }
//  select2() {
//   $('.select').select2({ width: '100%' });
//  }
//  Listar() {
//    this.almacenServ.Read().subscribe((resp: any = []) => {
//      this.searchtselect.emit(resp);
//    });
//  }
 showSelectCategoria() {
   const vm = this;
   vm.isloadingCategoria = true;
 }
 showSelectLote() {
  const vm = this;
  vm.isloadingLote = true;
 }
 showSelectUnidaMedida() {
  const vm = this;
  vm.isloadingUnidadMedida = true;
}
 selectCategoria(event) {
   const vm = this;
   vm.categoria = event.clas_name;
   vm.isloadingCategoria = false;
   vm.filtro.emit(event);
 }
 selectLote(event) {
  const vm = this;
  vm.lote = event.lot_name;
  vm.isloadingLote = false;
  vm.filtro.emit(event);
 }
 selectUnidad(event) {
  const vm = this;
  vm.unidadMedida = event.um_name;
  vm.isloadingUnidadMedida = false;
  vm.filtro.emit(event);
 }
}
