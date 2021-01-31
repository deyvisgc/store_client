import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as JsBarcode from 'jsbarcode';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { AlmacenService } from '../../service/Almacen/almacen.service';
import { EnviromentService } from '../../service/enviroment.service';
declare const $: any;
@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.sass']
})
export class ProductoComponent implements OnInit {
  form: FormGroup;
  Codigo = 'P';
  CodigoBarra;
  cantidad = 1;
  lote: any = [];
  clase: any = [];
  unidad: any = [];
  id_produ: any;
  constructor(private dynamicScriptLoader: DynamicScriptLoaderService, private fb: FormBuilder, private almacenServ: AlmacenService ) {
    this.Listar();
    this.form = this.fb.group({
      pro_nombre: [''],
      pro_precio_compra: [''],
      pro_precio_venta: [''],
      cantidad: [''],
      cantidad_minima: [''],
      codigo: [''],
      codigo_barra: [''],
      lote: [''],
      clase: [''],
      unidad: [''],
      descripcion: [],
      idproducto : ['']
    });
   }

  ngOnInit() {
    'use strict';
    this.startScript();
    $('body').on('hidden.bs.modal', '.modal', () => {
        $('#clase_update').empty();
        $('#lote_update').empty();
        $('#unidad_update').empty();
        this.Codigo = 'P'; 
        this.CODIGO(localStorage.getItem('lasidproducto'));
      });
  }
  async startScript() {
    await this.dynamicScriptLoader.load('form.min', 'bootstrap-colorpicker').then(data => {
      this.loadData();
    }).catch(error => console.log(error));
  }
  private loadData() {
    this.select();
    $('#tableExport').DataTable();
    $('.lote').select2({ width: '100%' });
    $('.clase').select2({ width: '100%' });
    $('.unidad').select2({ width: '100%' });
  }
     public Listar() {
      this.almacenServ.Read().subscribe((data: any = [] ) => {
        if (data.length > 0) {
          const ultimoElemento = data[data.length - 1];
          localStorage.setItem('lasidproducto', ultimoElemento.id_product);
          this.CODIGO(ultimoElemento.id_product);
          this.datatable('.tbproducto', data);
        } else {
          this.datatable('.tbproducto', data); 
        }
      });
     }
   public CODIGO(lastidproduct) {
     let vem = this;
     vem.Codigo = vem.Codigo + '00000' + lastidproduct;
   }
   public GenerarCode() {
    this.CodigoBarra = '775820300317';
    const lastidproducto = localStorage.getItem('lasidproducto');
    this.CodigoBarra = this.CodigoBarra.concat(lastidproducto);
    JsBarcode('#barcode', this.CodigoBarra, {
      format: 'CODE128',
      width: 2,
      height: 50,
      marginLeft: 85
    });
    this.imprimir();
   }
   public imprimir() {
    const ficha = document.getElementById('divbarcode');
    const ventimp = window.open(' ', 'popimpr');
    ventimp.document.write( ficha.innerHTML );
    ventimp.document.close();
    ventimp.print( );
    ventimp.close();
   }
   public Registrar() {
    this.addaaray('lote', 'clase', 'unidad');
    this.almacenServ.Registrar(this.form.value).subscribe( res => {
     if ( res['status'] === true) {
       $('#modalRegistrar').modal('hide');
       this.Listar();
       this.limpiar();
       alert (res['message']);
     } else {
      alert (res['message']);
     }
     });
   }
   public  select() {
      this.almacenServ.Lote().subscribe(res => {this.lote = res});
      this.almacenServ.UnidadMedida().subscribe(res => { this.unidad = res;console.log(this.unidad)});
      this.almacenServ.Clase().subscribe(res => {this.clase = res});
   }
   datatable(url, data) {
    $(url).DataTable({
       // tslint:disable-next-line:object-literal-shorthand
       data: data,
        columns: [
        { data: 'pro_name'},
        { data: 'pro_cod_barra'},
        { data: 'pro_precio_compra'},
        { data: 'pro_precio_venta'},
        { data: 'pro_cantidad' },
        { data: 'pro_status',
        // tslint:disable-next-line:object-literal-shorthand
        render: function(data, type, row) {
          if (row.pro_status === '1') {
            return '<span _ngcontent-uwn-c151="" class="badge bg-green">Activo</span>';
          } else {
            return '<span _ngcontent-uwn-c151="" class="badge bg-red"></span>';
          }
        }
      },
      {  data: function(data) {return (
        // tslint:disable-next-line:max-line-length
                '<button _ngcontent-xkn-c6="" class="btn bg-green btn-circle waves-effect waves-circle waves-float edit" type="button" style="margin-left: 10px;font-size: 20px;"><i style="padding-bottom:20px" class="fas fa-pen"></i></button>'+ '<button _ngcontent-xkn-c6="" class="btn bg-red btn-circle waves-effect waves-circle waves-float dowpdf" type="button" style="margin-left: 10px;font-size: 20px;"><i class="fas fa-trash-alt"></i></button>'); }
        //'<div _ngcontent-dcv-c5="" class="demo-switch"> <button _ngcontent-xkn-c6="" class="btn bg-green btn-circle waves-effect waves-circle waves-float dowpdf" type="button" style="margin-left: 10px;font-size: 20px;"><i class="fas fa-file-pdf"></i></button> <div _ngcontent-dcv-c5=""  style="margin-left: 10px;font-size: 20px;" class="switch selectproducto"><label _ngcontent-dcv-c5="">ACTI <input _ngcontent-dcv-c5=""  value="' + data.idproduct + '" checked="selected"   type="checkbox"><span _ngcontent-dcv-c5="" class="lever"></span>INAC</label></div>'); }
      },
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const vem = this;
        $('.edit', row).bind('click', () => {
          vem.editar(data);
         });
        return row;
      },
      language: {
        decimal: '',
        emptyTable: 'No exsiten Productos',
        info: 'Mostrando _START_ a _END_ de _TOTAL_ Entradas',
        infoEmpty: 'Mostrando 0 to 0 of 0 Entradas',
        infoFiltered: '(Filtrado de _MAX_ total entradas)',
        infoPostFix: '',
        thousands: ',',
        lengthMenu: 'Mostrar _MENU_ Entradas',
        loadingRecords: 'Cargando...',
        processing: 'Procesando...',
        search: 'Buscar:',
        zeroRecords: 'Sin resultados encontrados',
        paginate: {
          first: 'Primero',
          last: 'Ultimo',
          next: 'Siguiente',
          previous: 'Anterior'
        }
      },
      order: [],
      destroy: true
    });
  }
  public limpiar() {
    this.form.controls.pro_nombre.setValue(['']);
    this.form.controls.pro_precio_compra.setValue(['']);
    this.form.controls.pro_precio_venta.setValue(['']);
    this.form.controls.cantidad.setValue(['']);
    this.form.controls.cantidad_minima.setValue(['']);
    this.form.controls.codigo.setValue(['']);
    this.form.controls.descripcion.setValue(['']);
    this.form.controls.codigo_barra.setValue(['']);
    this.form.controls.lote.setValue(['']);
    this.form.controls.clase.setValue(['']);
    this.form.controls.unidad.setValue(['']);
    $('#barcode').html('');
   }
   editar(produ: any) {
      this.almacenServ.Readxid(produ.id_product).subscribe((res: any = []) => {
        const data = [];
        if (res['producto'] != null) {
          $('#modalUpdate').modal('show');
          this.form.controls.idproducto.setValue(res['producto'].id_product);
          this.form.controls.pro_nombre.setValue(res['producto'].pro_name);
          this.form.controls.pro_precio_compra.setValue(res['producto'].pro_precio_compra);
          this.form.controls.pro_precio_venta.setValue(res['producto'].pro_precio_compra);
          this.form.controls.cantidad.setValue(res['producto'].pro_cantidad);
          this.form.controls.cantidad_minima.setValue(res['producto'].pro_cantidad_min);
          this.form.controls.codigo.setValue(res['producto'].pro_code);
          this.form.controls.descripcion.setValue(res['producto'].pro_description);
          this.form.controls.codigo_barra.setValue(res['producto'].pro_cod_barra);
          data.push(res['producto']);
          data.forEach(prod => {
            res['clase'].forEach(clas => {
              if (prod.id_clase_producto === clas.id_clase_producto) {
                $('#clase_update').append('<option value=' + clas.id_clase_producto + '  selected >' + clas.clas_name + '</option>');
              } else {
                $('#clase_update').append('<option value=' + clas.id_clase_producto + '  >' + clas.clas_name + '</option>');
              }
            });
            res['lote'].forEach(lote => {
              if (prod.id_lote === lote.id_lote) {
                $('#lote_update').append('<option value=' + lote.id_lote + '  selected >' + lote.lot_name + '</option>');
              } else {
                $('#lote_update').append('<option value=' + lote.id_lote + '  >' + lote.lot_name + '</option>');
              }
            });
            res['unidad'].forEach(uni => {
              if (prod.id_unidad_medida === uni.id_unidad_medida) {
                $('#unidad_update').append('<option value=' + uni.id_unidad_medida + ' selected >' + uni.um_name + '</option>');
              } else {
                $('#unidad_update').append('<option value=' + uni.id_unidad_medida + '  >' + uni.um_name + '</option>');
              }
            });
          });
        }
      });
   }
   Actualizar() {
    this.addaaray('lote_update', 'clase_update', 'unidad_update');
    console.log(this.form.value);
    this.almacenServ.Upddate(this.form.value).subscribe(res => {
      if ( res['status'] === true) {
        $('#modalRegistrar').modal('hide');
        this.Listar();
        this.limpiar();
        alert (res['message']);
      } else {
       alert (res['message']);
      }
    })
   }
   addaaray(lot, clas, uni) {
    let barcode = document.getElementById('codigo_barra')["value"];
    let cod = document.getElementById('codigo')["value"];
    let lote = document.getElementById(lot)["value"];
    let clase = document.getElementById(clas)["value"];
    let unidad = document.getElementById(uni)["value"];

    this.form.controls.lote.setValue(lote);
    this.form.controls.clase.setValue(clase);
    this.form.controls.unidad.setValue(unidad);
    this.form.controls.codigo_barra.setValue(barcode);
    this.form.controls.codigo.setValue(cod);
   }
}
