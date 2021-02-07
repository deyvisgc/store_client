import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import iziToast from 'izitoast';
import * as JsBarcode from 'jsbarcode';
import { NgxIzitoastService } from 'ngx-izitoast';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { AlmacenService } from '../../service/Almacen/almacen.service';
import { EnviromentService } from '../../service/enviroment.service';
import swal from 'sweetalert2';
declare const $: any;
@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.sass']
})
export class ProductoComponent implements OnInit {
  form: FormGroup;
  Codigo = 'P';
  gncodebarra = '';
  CodigoBarra;
  cantidad = 1;
  lote: any = [];
  clase: any = [];
  unidad: any = [];
  lote1: any = [];
  clase1: any = [];
  unidad1: any = [];
  id_produ: any;
  precarcodebarra = false;
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
    this.startScript();
    $('body').on('hidden.bs.modal', '.modal', () => {
        $('#clase_update').empty();
        $('#lote_update').empty();
        $('#unidad_update').empty();
        this.Codigo = 'P'; 
        this.CODIGO(localStorage.getItem('lasidproducto'));
      });
  }
  private loadData() {
    this.select();
    $('#loteseach').select2().on('change', (event) => {
       this.searchxType(event.target.value, 'lote');
    });
    $('#claseseach').select2().on('change', (event) => {
      this.searchxType(event.target.value, 'clase');
   });
    $('#unidadseacrh').select2().on('change', (event) => {
    this.searchxType(event.target.value, 'unidad');
    });
    $('.lote').select2({ width: '100%' });
    $('.clase').select2({ width: '100%' });
    $('.unidad').select2({ width: '100%' });
    $('.cantida_generate').select2({ width: '100%' });
  }
  async startScript() {
    await this.dynamicScriptLoader.load('form.min').then(data => {
      this.loadData();
    }).catch(error => console.log(error));
  }
     public Listar() {
      let datadesacti: any = [];
      let dataactiva: any = [];
      this.almacenServ.Read().subscribe((data: any = [] ) => {
        if (data.length > 0) {
          const ultimoElemento = data[data.length - 1];
          localStorage.setItem('lasidproducto', ultimoElemento.id_product);
          this.CODIGO(ultimoElemento.id_product);
          datadesacti = data.filter(o => o.pro_status !== '1');
          dataactiva = data.filter(o => o.pro_status !== '0');
          this.datatable('.tbproductodesac', datadesacti);
          this.datatable('.tbproducto', dataactiva);
        } else {
          this.datatable('.tbproducto', data);
          this.datatable('.tbproducto-desactivida', data);
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
   }
   public imprimir() {
    const ficha = document.getElementById('divbarcodeprint');
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
       iziToast.success({
        title: 'OK',
        position: 'topRight',
        message: res['message'],
    });
     } else {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: res['message'],
    });
     }
     });
   }
   public  select() {
      // tslint:disable-next-line:semicolon
      this.almacenServ.Lote().subscribe(res => {
        this.lote = res;
        this.lote1 = res;
        console.log(this.lote1);
      });
      // tslint:disable-next-line:semicolon
      this.almacenServ.UnidadMedida().subscribe(resp => { 
        this.unidad = resp;
        this.unidad1 = resp;
        console.log(this.unidad1);
      });
      // tslint:disable-next-line:semicolon
      this.almacenServ.Clase().subscribe(respcla => {
        this.clase = respcla;
        this.clase1 = respcla;
        console.log(this.clase1);
      });
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
            return '<span _ngcontent-uwn-c151="" class="badge bg-green">ACTIVO</span>';
          } else {
            return '<span _ngcontent-uwn-c151="" class="badge bg-red">INACTIVO</span>';
          }
        }
      },
      { data: function(data)
        {
          if (data.pro_status === '1') {
            return (
              // tslint:disable-next-line:max-line-length
                      '<button _ngcontent-xkn-c6=""  title="ACTUALIZAR" class="btn bg-green btn-circle  waves-effect waves-circle waves-float edit" type="button" style="margin-left: 5px;font-size: 20px;"><i style="padding-bottom:20px" class="fas fa-pen"></i></button>'+ '<button _ngcontent-xkn-c6=""  title="ELIMINAR" class="btn bg-red btn-circle waves-effect waves-circle waves-float delete" type="button" style="margin-left: 5px;font-size: 20px;"><i class="fas fa-trash-alt"></i></button>' + '<button _ngcontent-xkn-c6="" title="DESACTIVAR" class="btn btn-info btn-circle waves-effect waves-circle waves-float status" type="button" style="margin-left: 5px;font-size: 20px;"><i class="fas fa-frown"></i></button>' + '<button _ngcontent-xkn-c6="" class="btn bg-deep-purple btn-circle waves-effect waves-circle waves-float printcodebarra"  title="IMPRIMIR CODIGO BARRA" type="button" style="margin-left: 5px;font-size: 20px;"><i class="fa fa-barcode" aria-hidden="true"></i></button>');
          } else {
            return (
              // tslint:disable-next-line:max-line-length
                      '<button _ngcontent-xkn-c6=""  title="ACTUALIZAR" class="btn bg-green btn-circle waves-effect waves-circle waves-float edit" type="button" style="margin-left: 5px;font-size: 20px;"><i style="padding-bottom:20px" class="fas fa-pen"></i></button>'+ '<button _ngcontent-xkn-c6="" title="ELIMINAR" class="btn bg-red btn-circle waves-effect waves-circle waves-float delete" type="button" style="margin-left: 5px;font-size: 20px;"><i class="fas fa-trash-alt"></i></button>' + '<button _ngcontent-xkn-c6="" title="ACTIVAR" class="btn bg-deep-orange btn-circle waves-effect waves-circle waves-float status" type="button" style="margin-left: 5px;font-size: 20px;"><i class="fas fa-grin-beam"></i></button>' + '<button _ngcontent-xkn-c6="" class="btn bg-deep-purple btn-circle waves-effect waves-circle waves-float printcodebarra"  title="IMPRIMIR CODIGO BARRA" type="button" style="margin-left: 5px;font-size: 20px;"><i class="fa fa-barcode" aria-hidden="true"></i></button>');
          }
          }
      },
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const vem = this;
        $('.edit', row).bind('click', () => {
          vem.editar(data);
         });
        $('.delete', row).bind('click', () => {

          vem.delete(data);
         });
        $('.status', row).bind('click', () => {
           vem.changestatus(data);
         });
        $('.printcodebarra', row).bind('click', () => {
          vem.printcodebarra(data);
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
        $('#modalUpdate').modal('hide');
        this.Listar();
        this.limpiar();
        iziToast.success({
          title: 'OK',
          position: 'topRight',
          message: res['message'],
      });
      } else {
        iziToast.error({
          title: 'Error',
          position: 'topRight',
          message: res['message'],
      });
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
   searchxType(event, searctype) {
     const data = [{
       typesearch : searctype,
       id : event
     }];
     this.almacenServ.SearchxType(data).subscribe((resp: any = []) => {
      if (resp.length > 0) {
        iziToast.success({
          title: 'Succes',
          position: 'topRight',
          message: 'productos encontrados',
      });
        this.datatable('.tbproducto', resp);
      } else {
        iziToast.error({
          title: 'Error',
          message: 'productos no encontrados',
      });
        this.datatable('.tbproducto', resp);
      }
     });
   }
   delete(info: any) {
    let me = this;
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: 'Seguro de eliminar este producto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        me.almacenServ.Delete(info.id_product).subscribe(res => {
          if (res['status'] === true) {
            swalWithBootstrapButtons.fire(
              'Deleted!',
              'Su Producto ha sido eliminado.',
              'success');
            this.Listar();
          } else {
            swalWithBootstrapButtons.fire(
              'Error!',
              'Producto no eliminado',
              'error');
          }
        });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Tu Producto está a salvo :)',
          'error'
          );
      }
    });
   }
   changestatus(info: any) {
       const data = [{id: info.id_product, status: info.pro_status}];
       this.almacenServ.changestatus(data).subscribe(res => {
         if (res['status'] === true) {
          iziToast.success({
            title: 'Succes',
            position: 'topRight',
            message: res['message'],
        });
          this.Listar();
         } else {
          iziToast.error({
            title: 'Error',
            position: 'topRight',
            message: res['message'],
        });
         }
      });
   }
   printcodebarra(code: any) {
     this.gncodebarra = code.pro_cod_barra;
     $('#gcodebarra').modal('show');
   }
   ImprimirCode() {
     this.precarcodebarra = true;
     let n = 0;
     let cantidaGenerate = document.getElementById('cantida_generate')['value'];
     for (let i = 0; i < cantidaGenerate; i++) {
      n = i;
      $('#divbarcodeprint').append('<svg style="width:10; height: 10; display:none" id="barcodeprint"></svg>');
      JsBarcode('#barcodeprint', this.gncodebarra, {
        format: 'CODE128',
        width: 2,
        height: 50,
        marginLeft: 85
      });
    }
     this.precarcodebarra = false;
     this.imprimir();
     $('#divbarcodeprint').empty();
   }
}
