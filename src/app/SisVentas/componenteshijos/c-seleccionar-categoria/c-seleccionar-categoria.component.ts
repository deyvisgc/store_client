import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CategoriaService } from '../../service/Almacen/categoria/categoria.service';
declare const sendRespuesta: any;
@Component({
  selector: 'app-c-seleccionar-categoria',
  templateUrl: './c-seleccionar-categoria.component.html',
  styleUrls: ['./c-seleccionar-categoria.component.css']
})
export class CSeleccionarCategoriaComponent implements OnInit {
  @Output() cate = new EventEmitter<any>();
  @Input() isActiveCategoria: boolean;
  listCategoria = [];
  params = {
    numeroRecnum: 0,
    noMore: false
  };
  isScroll: boolean;
  isloadinglista: boolean;
  modalScrollDistance = 2;
  modalScrollThrottle = 50;
  infiniteScrollStatus: boolean;
  categoria = '';
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
      vm.listCategoria = [];
      vm.params.numeroRecnum = 0;
    }
    vm.cateServ.getCategoria(vm.params).then(res => {
      const rpta = sendRespuesta(res);
      // tslint:disable-next-line:prefer-for-of
      for (let index = 0; index < rpta.lista.length; index++) {
        vm.listCategoria.push(rpta.lista[index]);
      }
      if (!rpta.noMore) {
        vm.params.numeroRecnum  = rpta.numeroRecnum;
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
    vm.cate.emit(e);
  }
  searchCategoria(search) {
    const vm = this;
    const params = search.target.value.length;
    if ( params > 2) {
      vm.cateServ.searchCategoria(search.target.value).then( res => {
        const rpta = sendRespuesta(res);
        const cantidad =  rpta.data.length;
        if (rpta.status && cantidad > 0) {
          vm.listCategoria = rpta.data;
        } else {
          vm.listCategoria = [];
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
      vm.listCategoria = [];
  }
  }
}
