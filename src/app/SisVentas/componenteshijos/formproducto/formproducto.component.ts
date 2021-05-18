import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlmacenService } from '../../service/Almacen/almacen.service';
import iziToast from 'izitoast';
import * as JsBarcode from 'jsbarcode';
import swal from 'sweetalert2';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { ProductoService } from '../../service/Almacen/producto/producto.service';
declare const $: any;
declare const sendRespuesta: any;
@Component({
  selector: 'app-formproducto',
  templateUrl: './formproducto.component.html',
  styleUrls: ['./formproducto.component.css']
})
export class FormproductoComponent implements OnInit {
  @Output() public productlist = new EventEmitter <any>();
  form: FormGroup;
  loading: boolean;
  btnform: boolean;
  btndisables: boolean;
  isLoading: boolean;
  CodigoBarra;
  selectedItem;
  subclase: any = [];
  cantidad = 1;
  lote: any = [];
  clase: any = [];
  unidad: any = [];
  isloadingCategoria: boolean;
  isloadingLote: boolean;
  isloadingUnidadMedida: boolean;
  constructor(private dynamicScriptLoader: DynamicScriptLoaderService, private fb: FormBuilder, private almacenServ: AlmacenService,
              private productServ: ProductoService) {
    this.form = this.fb.group({
      pro_nombre: [null, Validators.required],
      pro_precio_compra: [null, Validators.required],
      pro_precio_venta: [null, Validators.required],
      cantidad: [null, Validators.required],
      cantidad_minima: [null, Validators.required],
      codigo_barra: [null, Validators.required],
      lote:  [null, Validators.required],
      clase: [null, Validators.required],
      subclase: [null,  Validators.required],
      unidad: [null, Validators.required],
      descripcion: [null, Validators.required]
    });
  }
  ngOnInit() {
    this.startScript();
    window.addEventListener('keyup', e => {
      const vm = this;
      if (e.keyCode === 27) {
        vm.isloadingCategoria = false;
        vm.isloadingLote = false;
        vm.isloadingUnidadMedida = false;
      }
    });

  }
  private loadData() {
    this.select();
    this.desactiviarOrDesactivar(1);
    this.changeselect('.clase', '.subclase', '.lote', '.unidad');
    this.select2();
   }
   async startScript() {
    await this.dynamicScriptLoader.load('form.min').then(data => {
      this.loadData();
    }).catch(error => console.log(error));
   }
  public Registrar() {
    const vm = this;
    if (vm.form.valid) {
      vm.desactiviarOrDesactivar(2);
      vm.isLoading = true;
      vm.productServ.Registrar(vm.form.value).then( res => {
        const rpta = sendRespuesta(res);
        if ( rpta.status) {
          vm.reset();
          $('#modalRegistrar').modal('hide');
          vm.desactiviarOrDesactivar(1);
          iziToast.success({
           title: 'OK',
           position: 'topRight',
           message: rpta.message,
          });
          vm.productlist.emit(true);
         } else {
           vm.loading = false;
           iziToast.error({
            title: 'Error',
            position: 'topRight',
            message: rpta.message,
           });
           vm.productlist.emit(false);
         }
      }).catch((err) => {
        console.log('Error', err);
      }).finally(() => {
        vm.isLoading = false;
      });
     } else {
       Object.keys(vm.form.controls).forEach(field => { // {1}
         const control = vm.form.get(field);            // {2}
         control.markAsTouched({ onlySelf: true });       // {3}
       });
     }
  }
  isFieldValid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }
  displayFieldCss(field: string) {
    return {
   'has-error': this.isFieldValid(field),
   'has-feedback': this.isFieldValid(field)
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
 public GenerarCode() {
  this.CodigoBarra = '775820300317';
  const lastidproducto = localStorage.getItem('lasidproducto');
  this.CodigoBarra = this.CodigoBarra.concat(lastidproducto);
  this.form.controls.codigo_barra.setValue(this.CodigoBarra);
  JsBarcode('#barcode', this.CodigoBarra, {
    format: 'CODE128',
    width: 2,
    height: 50,
    marginLeft: 85
  });
 }
 public changeclasehija(event) {
  this.form.controls.clase.setValue(event);
  this.almacenServ.filtrarxclasepadre(event).subscribe((res: any = []) => {
    if (res.length > 0) {
      this.selectedItem = res[0]['idhijo'];
      this.form.controls.subclase.setValue(this.selectedItem);
      this.subclase = res;
      $('#subcategoria_update').empty();
      res.forEach(element => {
        $('#subcategoria_update').append('<option value=' + element.idhijo + '  >' + element.clasehijo + '</option>');
      });
      iziToast.success({
      title: 'Succes',
      position: 'topRight',
      message: 'Subcategorias Encontradas',
     });
    } else {
      iziToast.error({
      title: 'Error',
      position: 'topRight',
      message: 'Esta categoria no tiene subclases',
     });
    }
  });
 }
 select2() {
  $('.lote').select2({ width: '100%' });
  $('.clase').select2({ width: '100%' });
  $('.unidad').select2({ width: '100%' });
  $('.subclase').select2({ width: '100%' });
 }
 reset() {
  this.form.reset();
  $('#clase').val(null).trigger('change');
  $('#subclase').val(null).trigger('change');
  $('#lote').val(null).trigger('change');
  $('#unidad').val(null).trigger('change');
  $('#barcode').html('');
 }
 changeselect(clase , subclase, lote , unidad) {
  $(clase).select2().on('change', (event) => {
  this.changeclasehija(event.target.value);
  });
  $(subclase).select2().on('change', (event) => {
  this.form.controls.subclase.setValue(event.target.value);
  });
  $(lote).select2().on('change', (event) => {
  this.form.controls.lote.setValue(event.target.value);
  });
  $(unidad).select2().on('change', (event) => {
  this.form.controls.unidad.setValue(event.target.value);
  });
 }
 public  select() {
  this.almacenServ.Lote().subscribe(res => {
    this.lote = res;
  });
  this.almacenServ.UnidadMedida().subscribe(resp => {
    this.unidad = resp;
  });
  this.almacenServ.getClaseSupe().subscribe(respcla => {
    this.clase = respcla;
  });
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
 }
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
}
