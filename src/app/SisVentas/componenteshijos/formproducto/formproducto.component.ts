import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlmacenService } from '../../service/Almacen/almacen.service';
import iziToast from 'izitoast';
import * as JsBarcode from 'jsbarcode';
import swal from 'sweetalert2';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
declare const $: any;
@Component({
  selector: 'app-formproducto',
  templateUrl: './formproducto.component.html',
  styleUrls: ['./formproducto.component.sass']
})
export class FormproductoComponent implements OnInit {
  @Output() public productlist = new EventEmitter <any>();
  form: FormGroup;
  loading: boolean;
  btnform: boolean;
  btndisables: boolean;
  CodigoBarra;
  selectedItem;
  subclase: any = [];
  cantidad = 1;
  lote: any = [];
  clase: any = [];
  unidad: any = [];
  constructor(private dynamicScriptLoader: DynamicScriptLoaderService, private fb: FormBuilder, private almacenServ: AlmacenService) {
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
    if (this.form.valid) {
      this.desactiviarOrDesactivar(2);
      this.almacenServ.Registrar(this.form.value).subscribe( res => {
      // tslint:disable-next-line:no-string-literal
      if ( res['status'] === true) {
        this.reset();
        $('#modalRegistrar').modal('hide');
        this.desactiviarOrDesactivar(1);
        iziToast.success({
         title: 'OK',
         position: 'topRight',
         message: res['message'],
        });
        this.productlist.emit(true);
       } else {
         this.loading = false;
         iziToast.error({
          title: 'Error',
          position: 'topRight',
          // tslint:disable-next-line:no-string-literal
          message: res['message'],
         });
         this.productlist.emit(false);
       }
       });
     } else {
       Object.keys(this.form.controls).forEach(field => { // {1}
         const control = this.form.get(field);            // {2}
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
}
