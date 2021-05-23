import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CategoriaService } from '../../service/Almacen/categoria/categoria.service';
declare const sendRespuesta: any;
@Component({
  selector: 'app-c-seleccionar-sub-categoria',
  templateUrl: './c-seleccionar-sub-categoria.component.html',
  styleUrls: ['./c-seleccionar-sub-categoria.component.css']
})
export class CSeleccionarSubCategoriaComponent implements OnInit {
  @Output() subCate = new EventEmitter<any>();
  @Input() isActiveSubCategoria: boolean;
  @Input() idCate: number;
  list = [];
  params = {
    numeroRecnum: 0,
    noMore: false,
    cantidadRegistros: 5,
    idClase: 0
  };
  isScroll: boolean;
  isloadinglista: boolean;
  modalScrollDistance = 2;
  modalScrollThrottle = 50;
  infiniteScrollStatus: boolean;
  constructor(private cateServ: CategoriaService) {
  }
  ngOnInit() {
    this.fetch();
  }
  onScrollDown() {
    this.isScroll = true;
    this.fetch();
  }
  fetch() {
    const vm = this;
    vm.isloadinglista = true;
    vm.infiniteScrollStatus = true;
    if (!vm.isScroll) {
      vm.list = [];
      vm.params.numeroRecnum = 0;
    }
    vm.params.idClase = vm.idCate;
    vm.cateServ.filtrarxclasepadre(vm.params).then(res => {
      const rpta = sendRespuesta(res);
      // tslint:disable-next-line:prefer-for-of
      for (let index = 0; index < rpta.data[0].length; index++) {
        vm.list.push(rpta.data[0][index]);
      }
      if (!rpta.data.noMore) {
        vm.params.numeroRecnum  = rpta.data.numeroRecnum;
        vm.infiniteScrollStatus = false;
      } else {
        vm.infiniteScrollStatus = true;
      }
    }).catch(() => {
      vm.isScroll = false;
    }).finally(() => {
      vm.isloadinglista = false;
    });
  }
  seleccionarClick(e) {
    const vm = this;
    vm.subCate.emit(e);
  }
  searchCategoria(search) {
    const vm = this;
    const params = search.target.value.length;
    if ( params > 2) {
      vm.cateServ.searchCategoria(search.target.value).then( res => {
        const rpta = sendRespuesta(res);
        const cantidad =  rpta.data.length;
        if (rpta.status && cantidad > 0) {
          vm.list = rpta.data;
        } else {
          vm.list = [];
          vm.isloadinglista = false;
        }
      }).catch((err) => {
        console.log('Error', err);
      }).finally(() => {
        console.log('finaly');
      });
    }
    if (params === 0) {
      this.fetch();
      vm.list = [];
  }
  }
}
