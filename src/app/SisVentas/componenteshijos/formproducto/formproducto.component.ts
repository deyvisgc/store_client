import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlmacenService } from '../../service/Almacen/almacen.service';
import iziToast from 'izitoast';
import * as JsBarcode from 'jsbarcode';
import swal from 'sweetalert2';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { ProductoService } from '../../service/Almacen/producto/producto.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnviromentService } from '../../service/enviroment.service';
declare const $: any;
declare const sendRespuesta: any;
@Component({
  selector: 'app-formproducto',
  templateUrl: './formproducto.component.html',
  styleUrls: ['./formproducto.component.css']
})
export class FormproductoComponent implements OnInit {
  httpHeaders = new HttpHeaders()
  .append('Authorization',  'Bearer' + ' ' + localStorage.getItem('token'));
  @Output() public productlist = new EventEmitter <any>();
  form: FormGroup;
  loading: boolean;
  btnform: boolean;
  btndisables: boolean;
  isLoading: boolean;
  CodigoBarra;
  selectedItem;
  idClaseProducto: number;
  cantidad = 1;
  isloadingCategoria: boolean;
  isloadingLote: boolean;
  isloadingUnidadMedida: boolean;
  isActiveSubCategoria: boolean;
  file = '';
  constructor(private fb: FormBuilder, private productServ: ProductoService, private http: HttpClient, private url: EnviromentService) {
    this.form = this.fb.group({
      pro_nombre: [null, Validators.required],
      pro_precio_compra: [null, Validators.required],
      pro_precio_venta: [null, Validators.required],
      cantidad: [null, Validators.required],
      cantidad_minima: [null, Validators.required],
      codigo_barra: [null, Validators.required],
      descripcion: [null, Validators.required],
      lote:  [null, Validators.required],
      id_lote: [null],
      clase: [null, Validators.required],
      id_clase: [null],
      subclase: [null,  Validators.required],
      id_sub_clase: [null],
      unidad: [null, Validators.required],
      id_unidad: [null],
      id_producto: 0
    });
  }
  ngOnInit() {
    window.addEventListener('keyup', e => {
      const vm = this;
      if (e.keyCode === 27) {
        vm.isloadingCategoria = false;
        vm.isloadingLote = false;
        vm.isloadingUnidadMedida = false;
        vm.isActiveSubCategoria = false;
      }
    });

  }
  Registrar() {
    const vm = this;
    vm.isLoading = true;
    // vm.http.post(vm.url.urlAddress + 'create-product', {form}, {headers: this.httpHeaders}).subscribe((res) => {
    //   console.log('res');
    // })
    const formData = new FormData();
    formData.append('file', vm.file);
    formData.append('pro_nombre', vm.form.value.pro_nombre);
    formData.append('pro_precio_compra', vm.form.value.pro_precio_compra);
    formData.append('pro_precio_venta', vm.form.value.pro_precio_venta);
    formData.append('cantidad', vm.form.value.cantidad);
    formData.append('cantidad_minima', vm.form.value.cantidad_minima);
    formData.append('codigo_barra', vm.form.value.codigo_barra);
    formData.append('descripcion', vm.form.value.descripcion);
    formData.append('clase', vm.form.value.id_clase);
    formData.append('sub_clase', vm.form.value.id_sub_clase);
    formData.append('lote', vm.form.value.id_lote);
    formData.append('unidad', vm.form.value.id_unidad);
    vm.productServ.Registrar(formData).then( res => {
      const rpta = sendRespuesta(res);
    });
    // formData.append('form', );
    // vm.http.post(vm.url.urlAddress + 'create-product', formData, {headers: this.httpHeaders})  //{headers: this.httpHeaders})
    //   .subscribe(res => {
    //     console.log(res);
    //     alert('SUCCESS !!');
    // });
    // if (vm.form.valid) {
    //   // vm.desactiviarOrDesactivar(2);
    //  } else {
    //    Object.keys(vm.form.controls).forEach(field => { // {1}
    //      const control = vm.form.get(field);            // {2}
    //      control.markAsTouched({ onlySelf: true });       // {3}
    //    });
    //  }
  }
  isFieldValid(field: string) {
    const vm = this;
    return !vm.form.get(field).valid && vm.form.get(field).touched;
  }
  displayFieldCss(field: string) {
    const vm = this;
    return {
      'has-error': vm.isFieldValid(field),
      'has-feedback': vm.isFieldValid(field)
    };
  }
  desactiviarOrDesactivar(valor) {
    switch (valor) {
      case 1:
        this.loading = false;
        this.btnform = true;
        this.btndisables = false;
        break;
      case 2:
        this.loading = true;
        this.btnform = false;
        this.btndisables = true;
        break;
    }
  }
  GenerarCode() {
    const vm = this;
    vm.CodigoBarra = '775820300317';
    const lastidproducto = localStorage.getItem('lasidproducto');
    vm.CodigoBarra = vm.CodigoBarra.concat(lastidproducto);
    vm.form.controls.codigo_barra.setValue(vm.CodigoBarra);
    JsBarcode('#barcode', vm.CodigoBarra, {
      format: 'CODE128',
      width: 2,
      height: 50,
      marginLeft: 85
    });
  }
  reset() {
    const vm = this;
    vm.form.reset();
  }
  Adjuntar(event) {
   const vm = this;
   // Creamos el objeto de la clase FileReader
   const reader = new FileReader();
    // Leemos el archivo subido y se lo pasamos a nuestro fileReader
   reader.readAsDataURL(event.target.files[0]);
    // Le decimos que cuando este listo ejecute el código interno
   // tslint:disable-next-line:only-arrow-functions
   reader.onload = function() {
      const preview = document.getElementById('preview');
      const image = document.createElement('img');
      image.src = reader.result as string;
      image.style.width = '200px';
      image.style.height = '90px';
      preview.innerHTML = '';
      preview.append(image);
   };
   vm.file = event.target.files[0];
  }
  showSelectCategoria() {
    const vm = this;
    vm.ShowPopap(true, false, false, false);
  }
  showSelectLote() {
    const vm = this;
    vm.ShowPopap(false, false, true, false);
  }
  showSelectUnidaMedida() {
    const vm = this;
    vm.ShowPopap(false, false, false, true);
  }
  showSubcategoria() {
    const vm = this;
    if (vm.form.value.id_clase > 0) {
    vm.idClaseProducto = vm.form.value.id_clase;
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
    vm.form.controls.clase.setValue(event.clas_name);
    vm.form.controls.id_clase.setValue(event.id_clase_producto);
    vm.isloadingCategoria = false;
  }
  selectSubCate(event) {
    const vm = this;
    vm.form.controls.subclase.setValue(event.clasehijo);
    vm.form.controls.id_sub_clase.setValue(event.idhijo);
    vm.isActiveSubCategoria = false;
  }
  selectLote(event) {
    const vm = this;
    vm.form.controls.lote.setValue(event.lot_name);
    vm.form.controls.id_lote.setValue(event.id_lote);
    vm.isloadingLote = false;
  }
  selectUnidadMedida(event) {
    const vm = this;
    vm.form.controls.unidad.setValue(event.um_name);
    vm.form.controls.id_unidad.setValue(event.id_unidad_medida);
    vm.isloadingUnidadMedida = false;
  }
  edit(producto) {
    const vm = this;
    vm.form.controls.id_producto.setValue(producto.data.product.id_product);
    vm.form.controls.pro_nombre.setValue(producto.data.product.pro_name);
    vm.form.controls.pro_precio_compra.setValue(producto.data.product.pro_precio_compra);
    vm.form.controls.pro_precio_venta.setValue(producto.data.product.pro_precio_compra);
    vm.form.controls.cantidad.setValue(producto.data.product.pro_cantidad);
    vm.form.controls.cantidad_minima.setValue(producto.data.product.pro_cantidad_min);
    vm.form.controls.descripcion.setValue(producto.data.product.pro_description);
    vm.form.controls.codigo_barra.setValue(producto.data.product.pro_cod_barra);
    vm.form.controls.clase.setValue(producto.data.product.clasPadre);
    vm.form.controls.subclase.setValue(producto.data.product.classHijo);
    vm.form.controls.lote.setValue(producto.data.product.lot_name);
    vm.form.controls.unidad.setValue(producto.data.product.um_name);
    vm.form.controls.id_clase.setValue(producto.data.product.id_clase_producto);
    console.log('Producto', producto);
  }
  ShowPopap(clase, subclase, lote, unidad) {
    const vm = this;
    vm.isloadingCategoria = clase;
    vm.isActiveSubCategoria = subclase;
    vm.isloadingLote = lote;
    vm.isloadingUnidadMedida = unidad;
  }
}
