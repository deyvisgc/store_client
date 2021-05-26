import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlmacenService } from '../../service/Almacen/almacen.service';
import iziToast from 'izitoast';
import * as JsBarcode from 'jsbarcode';
import swal from 'sweetalert2';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { ProductoService } from '../../service/Almacen/producto/producto.service';
declare const $: any;
declare const sendRespuesta: any;
declare const flatpickr: any;
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import * as moment from 'moment';
import { LoteService } from '../../service/Almacen/lote/lote.service';
@Component({
  selector: 'app-formproducto',
  templateUrl: './formproducto.component.html',
  styleUrls: ['./formproducto.component.css']
})
export class FormproductoComponent implements OnInit {
  @Output() public productlist = new EventEmitter <any>();
  isLoading: boolean;
  idClaseProducto: number;
  isloadingCategoria: boolean;
  isloadingUnidadMedida: boolean;
  isActiveSubCategoria: boolean;
  // file = '';
  isUnidad = false;
  fechahoy = moment().format('DD-MM-YYYY');
  fechaexpiracion = moment().add(1, 'months').format('YYYY-MM-DD');
  status = false;
  product = {
    pro_nombre: '',
    pro_precio_compra: 0,
    pro_precio_venta: 0,
    cantidad: 1,
    codigo_barra: '',
    descripcion: '',
    clase: '',
    id_clase: 0,
    subclase: '',
    id_sub_clase: 0,
    unidad: '',
    id_unidad: 0,
    id_producto: 0,
    fecha_creacion: this.fechahoy,
    lote: []
  };
  constructor(private fb: FormBuilder, private productServ: ProductoService,
              private dynamicScriptLoader: DynamicScriptLoaderService,
              private lotServ: LoteService) {
  }
  ngOnInit() {
    this.reset();
    window.addEventListener('keyup', e => {
      const vm = this;
      if (e.keyCode === 27) {
        vm.isloadingCategoria = false;
        vm.isloadingUnidadMedida = false;
        vm.isActiveSubCategoria = false;
      }
    });
    this.startScript();
  }
  private loadData() {
    flatpickr('#fecha_creacion', {
      locale: Spanish,
      dateFormat: 'd-m-Y',
      // defaultDate: [this.fechahoy]
    });
  }
  async startScript() {
    await this.dynamicScriptLoader.load('form.min').then(data => {
      this.loadData();
    }).catch(error => console.log(error));
  }
  GenerarProducto() {
    const vm = this;
    vm.isLoading = true;
    const isValiate = vm.validarProducto();
    if (isValiate) {
      if (!vm.isUnidad) {
        vm.product.lote = [];
      }
      vm.productServ.generarProducto(vm.product).then( res => {
        const rpta = sendRespuesta(res);
        if (rpta.status) {
          iziToast.success({
            title: 'Exito',
            position: 'topRight',
            message: rpta.message,
          });
          vm.productlist.emit(true);
          vm.reset();
        } else {
          iziToast.error({
            title: 'Error',
            position: 'topRight',
            message: rpta.message,
          });
        }
      }).catch((err) => {
        console.log('Error', err);
      }).finally(() => {
        console.log('finall');
      });
    }
  }
  GenerarCode() {
    const vm = this;
    vm.productServ.LastIdProducto().then(res => {
      const rpta = sendRespuesta(res);
      if (rpta.status) {
        vm.product.codigo_barra = rpta.data.codigo;
        // JsBarcode('#barcode', rpta.data.codigo, {
        //   format: 'CODE128',
        //   width: 2,
        //   height: 50,
        //   marginLeft: 85
        // });
      } else {

      }
    }).catch((err) => {
      console.log('Error', err);
    }).finally(() => {
      console.log('Final');
    });
  }
  // Adjuntar(event) {
  //  const vm = this;
  //  // Creamos el objeto de la clase FileReader
  //  const reader = new FileReader();
  //   // Leemos el archivo subido y se lo pasamos a nuestro fileReader
  //  reader.readAsDataURL(event.target.files[0]);
  //   // Le decimos que cuando este listo ejecute el código interno
  //  // tslint:disable-next-line:only-arrow-functions
  //  reader.onload = function() {
  //     const preview = document.getElementById('preview');
  //     const image = document.createElement('img');
  //     image.src = reader.result as string;
  //     image.style.width = '200px';
  //     image.style.height = '90px';
  //     preview.innerHTML = '';
  //     preview.append(image);
  //  };
  //  vm.file = event.target.files[0];
  // }
  showSelectCategoria() {
    const vm = this;
    vm.ShowPopap(true, false, false, false);
  }
  showSelectUnidaMedida() {
    const vm = this;
    vm.ShowPopap(false, false, false, true);
  }
  showSubcategoria() {
    const vm = this;
    if (vm.product.id_clase > 0) {
    vm.idClaseProducto = vm.product.id_clase;
    vm.ShowPopap(false, true, false, false);
    } else {
    iziToast.error({
      title: 'Error',
      position: 'topRight',
      message: 'Seleccione una categoria',
    });
    }
  }
  selectCate(event) {
    const vm = this;
    vm.product.clase = event.clas_name;
    vm.product.id_clase = event.id_clase_producto;
    vm.isloadingCategoria = false;
  }
  selectSubCate(event) {
    const vm = this;
    vm.product.subclase = event.clasehijo;
    vm.product.id_sub_clase = event.idhijo;
    vm.isActiveSubCategoria = false;
  }
  selectUnidadMedida(event) {
    const vm = this;
    vm.product.unidad = event.um_name;
    vm.product.id_unidad = event.id_unidad_medida;
    vm.isloadingUnidadMedida = false;
  }
  edit(info) {
    const vm = this;
    vm.product.id_producto = info.data.product.id_product;
    vm.product.pro_nombre = info.data.product.pro_name;
    vm.product.pro_precio_compra = info.data.product.pro_precio_compra;
    vm.product.pro_precio_venta = info.data.product.pro_precio_compra;
    vm.product.cantidad = info.data.product.pro_cantidad;
    vm.product.descripcion = info.data.product.pro_description;
    vm.product.codigo_barra = info.data.product.pro_cod_barra;
    vm.product.clase = info.data.product.clasPadre;
    vm.product.id_clase = info.data.product.id_clase_producto;
    vm.product.subclase = info.data.product.classHijo;
    vm.product.id_sub_clase = info.data.product.id_subclase || 0;
    vm.product.unidad = info.data.product.um_name;
    vm.product.id_unidad = info.data.product.id_unidad_medida || 0;
    if (info.data.lote.length > 0) {
      vm.product.lote = info.data.lote;
      $('#checkbox').attr('checked' , false);
      vm.isUnidad = true;
    }
  }
  ShowPopap(clase, subclase, lote, unidad) {
    const vm = this;
    vm.isloadingCategoria = clase;
    vm.isActiveSubCategoria = subclase;
    vm.isloadingUnidadMedida = unidad;
  }
  validate(value) {
    const vm = this;
    if (value.target.checked) {
      vm.isUnidad = false;
    } else {
      vm.isUnidad = true;
    }
  }
  AgregarLotes() {
    const vm = this;
    if (!vm.product.pro_nombre || vm.product.pro_nombre.trim() === '') {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'Nombre producto necesario para agregar los lotes',
      });
      return false;
    }
    const obj = {
      pro_nombre: vm.product.pro_nombre
    };
    if (vm.product.lote.length === 0) {
      vm.lotServ.ObtenerCodeLote(obj).then( res => {
        const rpta = sendRespuesta(res);
        if (rpta.status) {
          const objLote = {
            lot_name: 'Lote' + rpta.data.lot_name,
            lot_code: rpta.data[0].codigo,
            cantidad: 1,
            lot_expiration_date: vm.fechaexpiracion,
          };
          vm.product.lote.push(objLote);
        }
      }).catch((err) => {
        console.log('Error', err);
      }).finally(() => {
        console.log('Finaly');
      });
    } else {
      let rpta = 0;
      // tslint:disable-next-line:no-unused-expression
      const lotCode = vm.product.lote[vm.product.lote.length - 1].lot_code;
      const lot = lotCode.substring(4, 9);
      console.log('lot', lot);
      const siglas = lotCode.substring(0, 4);
      const hola1 = '14215';
      let nameLote = '';
      let lotCod = '';
      if (+lot.substring(0, 1) > 0) {
        rpta = +lot.substring(0, 5);
        const rptatotal = rpta + 1;
        console.log('rptatotal1', rptatotal);
        // lotCod = siglas + rptatotal;
      } else if (+lot.substring(1, 2) > 0) {
          rpta = Number(hola1.substring(1, 5));
          const rptatotal = rpta + 1;
          console.log('rptatotal2', rptatotal);
          // lotCod = siglas + '0' + rptatotal;
      } else if (+lot.substring(2, 3) > 0) {
          rpta = +hola1.substring(2, 5);
          const rptatotal = rpta + 1;
          console.log('rptatotal3', rptatotal);
          // const rptatotal = rpta + 1;
          // lotCod = siglas + '00' + rptatotal;
      } else if (+lot.substring(3, 4) > 0) {
          rpta = +lot.substring(3, 5);
          const rptatotal = rpta + 1;
          lotCod = siglas + '000' + rptatotal;
          console.log('rptatotal4', lotCod);
          // console.log('rpta11111', rptatotal);
          // lotCod = siglas + '000' + rptatotal;
      } else {
          rpta = +lot.substring(4, 5);
          const rptatotal = rpta + 1;
          console.log('rptatotal5', rptatotal);
          // lotCod = siglas + '0000' + rptatotal;
      }
      // if (rpta > 0 && rpta < 9) {
      //   hola = rpta + 1;
      //   nameLote =  '0' + hola;
      // } else {
      //   const rptatotal = rpta + 1;
      //   nameLote = rptatotal.toString();
      // }
      // const objLote = {
      //   lot_name: 'Lote' + nameLote,
      //   lot_code: lotCod,
      //   cantidad: 1,
      //   lot_expiration_date: vm.fechaexpiracion,
      // };
      // vm.product.lote.push(objLote);
      // console.log('rpta', hola);
    }
  }
  eliminar(index) {
    const vm = this;
    vm.product.lote.splice(index, 1);
  }
  validarProducto() {
    const vm = this;
    if (!vm.product.pro_nombre) {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'Nombre Producto requerido',
      });
      return false;
    }
    if (vm.product.pro_precio_compra === 0  ||  !vm.product.pro_precio_compra) {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'Precio compra debe ser mayor a 0',
      });
      return false;
    }
    if (vm.product.pro_precio_venta === 0  ||  !vm.product.pro_precio_venta) {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'Precio venta debe ser mayor a 0',
      });
      return false;
    }
    if (!vm.product.fecha_creacion) {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'Fecha requerido',
      });
      return false;
    }
    if (vm.product.id_clase === 0) {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'Categoria requerido',
      });
      return false;
    }
    if (!this.isUnidad) {
      if (!vm.product.id_unidad) {
        iziToast.error({
          title: 'Error',
          position: 'topRight',
          message: 'Unidad de medida requerido',
        });
        return false;
      }
      if (vm.product.cantidad === 0 ||  !vm.product.cantidad) {
        iziToast.error({
          title: 'Error',
          position: 'topRight',
          message: 'Cantidad debe ser mayor a 0',
        });
        return false;
      }
    }
    return true;
  }
  reset() {
    const vm = this;
    $('body').on('hidden.bs.modal', '.modal', () => {
      vm.product.pro_nombre =  '';
      vm.product.pro_precio_compra = 0;
      vm.product.pro_precio_venta = 0;
      vm.product.cantidad = 1;
      vm.product.codigo_barra = '';
      vm.product.descripcion = '';
      vm.product.clase = '';
      vm.product.id_clase = 0;
      vm.product.subclase = '';
      vm.product.id_sub_clase = 0;
      vm.product.unidad = '';
      vm.product.id_unidad = 0;
      vm.product.id_producto = 0;
      vm.product.fecha_creacion = vm.fechahoy;
      vm.product.lote = [];
      $('#checkbox').attr('checked' , true);
      vm.isUnidad = false;
    });
  }
}
