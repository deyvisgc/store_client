import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductoService } from '../../service/Almacen/producto/producto.service';
declare const sendRespuesta: any;
@Component({
  selector: 'app-c-seleccionar-productos',
  templateUrl: './c-seleccionar-productos.component.html',
  styleUrls: ['./c-seleccionar-productos.component.css']
})
export class CSeleccionarProductosComponent implements OnInit {
  @Output() producto = new EventEmitter<any>();
  @Input() isActiveProducto: boolean;
  list = [];
  params = {
    numeroRecnum: 0,
    noMore: false,
    cantidadRegistros: 5,
    idClase: 0,
  };
  isScroll: boolean;
  isloadinglista: boolean;
  modalScrollDistance = 2;
  modalScrollThrottle = 50;
  infiniteScrollStatus: boolean;
  constructor(private servProduc: ProductoService) { }

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
    vm.servProduc.selectProducto(vm.params).then(res => {
      const rpta = sendRespuesta(res);
      // tslint:disable-next-line:prefer-for-of
      for (let index = 0; index < rpta.data.producto.length; index++) {
        vm.list.push(rpta.data.producto[index]);
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
    vm.producto.emit(e);
  }
  searchProducto(e) {
    const vm = this;
    const params = e.target.value.length;
    if ( params > 2) {
      vm.servProduc.search(e.target.value).then( res => {
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
  // searchCategoria(search) {
  //   const vm = this;
  //   const params = search.target.value.length;
  //   if ( params > 2) {
  //     vm.cateServ.searchCategoria(search.target.value).then( res => {
  //       const rpta = sendRespuesta(res);
  //       const cantidad =  rpta.data.length;
  //       if (rpta.status && cantidad > 0) {
  //         vm.list = rpta.data;
  //       } else {
  //         vm.list = [];
  //         vm.isloadinglista = false;
  //       }
  //     }).catch((err) => {
  //       console.log('Error', err);
  //     }).finally(() => {
  //       console.log('finaly');
  //     });
  //   }
  //   if (params === 0) {
  //     this.fetch();
  //     vm.list = [];
  // }
  // }

}
