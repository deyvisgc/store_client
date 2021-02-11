import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import iziToast from 'izitoast';
import * as JsBarcode from 'jsbarcode';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { AlmacenService } from '../../service/Almacen/almacen.service';
import swal from 'sweetalert2';
declare const $: any;
@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
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
  subclase: any = [];
  selectedItem;
  // id_produ: any;
  loading: boolean;
  btnform: boolean;
  btndisables: boolean;
  constructor(private dynamicScriptLoader: DynamicScriptLoaderService, private fb: FormBuilder, private almacenServ: AlmacenService ) {
    this.Listar();
    this.form = this.fb.group({
      pro_nombre: [null, Validators.required],
      pro_precio_compra: [null, Validators.required],
      pro_precio_venta: [null, Validators.required],
      cantidad: [null, Validators.required],
      cantidad_minima: [null, Validators.required],
      codigo: [null],
      codigo_barra: [null, Validators.required],
      lote:  [null, Validators.required],
      clase: [null, Validators.required],
      subclase: [null,  Validators.required],
      unidad: [null, Validators.required],
      descripcion: [null, Validators.required],
      idproducto : [0]
    });
   }

  ngOnInit() {
    this.startScript();
    $('body').on('hidden.bs.modal', '.modal', () => {
        $('#clase_update').empty();
        $('#lote_update').empty();
        $('#unidad_update').empty();
        $('#subcategoria_update').empty();
        this.Codigo = 'P';
        this.CODIGO(localStorage.getItem('lasidproducto'));
      });
  }
  private loadData() {
    this.select();
    this.desactiviarOrDesactivar(1);
    $('#loteseach').select2().on('change', (event) => {
       this.searchxType(event.target.value, 'lote');
    });
    $('#claseseach').select2().on('change', (event) => {
      this.searchxType(event.target.value, 'clase');
   });
    $('#unidadseacrh').select2().on('change', (event) => {
    this.searchxType(event.target.value, 'unidad');
    });
    this.changeselect('.clase', '.subclase', '.lote', '.unidad');
    this.select2();
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
          this.CODIGO(0);
        }
      });
     }
   public CODIGO(lastidproduct) {
     const vem = this;
     vem.Codigo = 'P';
     vem.Codigo = vem.Codigo + '00000' + lastidproduct;
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
   public imprimir() {
    const ficha = document.getElementById('divbarcodeprint');
    const ventimp = window.open(' ', 'popimpr');
    ventimp.document.write( ficha.innerHTML );
    ventimp.document.close();
    ventimp.print( );
    ventimp.close();
   }
   public Registrar() {
     this.addaaray();
     if (this.form.valid) {
       this.desactiviarOrDesactivar(2);
       this.almacenServ.Registrar(this.form.value).subscribe( res => {
       // tslint:disable-next-line:no-string-literal
       if ( res['status'] === true) {
         $('#modalRegistrar').modal('hide');
         this.desactiviarOrDesactivar(1);
         this.Listar();
         this.reset();
         iziToast.success({
          title: 'OK',
          position: 'topRight',
          // tslint:disable-next-line:no-string-literal
          message: res['message'],
         });
        } else {
          this.loading = false;
          iziToast.error({
           title: 'Error',
           position: 'topRight',
           // tslint:disable-next-line:no-string-literal
           message: res['message'],
          });
        }
        });
      } else {
        Object.keys(this.form.controls).forEach(field => { // {1}
          const control = this.form.get(field);            // {2}
          control.markAsTouched({ onlySelf: true });       // {3}
        });
      }
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
      this.almacenServ.getClaseSupe().subscribe(respcla => {
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
        render: (data1, type, row) => {
          if (row.pro_status === '1') {
            return '<span _ngcontent-uwn-c151="" class="badge bg-green">ACTIVO</span>';
          } else {
            return '<span _ngcontent-uwn-c151="" class="badge bg-red">INACTIVO</span>';
          }
        }
      },
      { data: (data1) => {
        if (data1.pro_status === '1') {
          return (
            // tslint:disable-next-line:max-line-length
            '<button _ngcontent-xkn-c6=""  title="ACTUALIZAR" class="btn bg-green btn-circle  waves-effect waves-circle waves-float edit" type="button" style="margin-left: 5px;font-size: 20px;"><i style="padding-bottom:20px" class="fas fa-pen"></i></button>' + '<button _ngcontent-xkn-c6=""  title="ELIMINAR" class="btn bg-red btn-circle waves-effect waves-circle waves-float delete" type="button" style="margin-left: 5px;font-size: 20px;"><i class="fas fa-trash-alt"></i></button>' + '<button _ngcontent-xkn-c6="" title="DESACTIVAR" class="btn btn-info btn-circle waves-effect waves-circle waves-float status" type="button" style="margin-left: 5px;font-size: 20px;"><i class="fas fa-frown"></i></button>' + '<button _ngcontent-xkn-c6="" class="btn bg-deep-purple btn-circle waves-effect waves-circle waves-float printcodebarra"  title="IMPRIMIR CODIGO BARRA" type="button" style="margin-left: 5px;font-size: 20px;"><i class="fa fa-barcode" aria-hidden="true"></i></button>');
        } else {
          return (
            // tslint:disable-next-line:max-line-length
            '<button _ngcontent-xkn-c6=""  title="ACTUALIZAR" class="btn bg-green btn-circle waves-effect waves-circle waves-float edit" type="button" style="margin-left: 5px;font-size: 20px;"><i style="padding-bottom:20px" class="fas fa-pen"></i></button>' + '<button _ngcontent-xkn-c6="" title="ELIMINAR" class="btn bg-red btn-circle waves-effect waves-circle waves-float delete" type="button" style="margin-left: 5px;font-size: 20px;"><i class="fas fa-trash-alt"></i></button>' + '<button _ngcontent-xkn-c6="" title="ACTIVAR" class="btn bg-deep-orange btn-circle waves-effect waves-circle waves-float status" type="button" style="margin-left: 5px;font-size: 20px;"><i class="fas fa-grin-beam"></i></button>' + '<button _ngcontent-xkn-c6="" class="btn bg-deep-purple btn-circle waves-effect waves-circle waves-float printcodebarra"  title="IMPRIMIR CODIGO BARRA" type="button" style="margin-left: 5px;font-size: 20px;"><i class="fa fa-barcode" aria-hidden="true"></i></button>');
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
    public changeclasehija(event) {
      this.form.controls.clase.setValue(event);
      this.almacenServ.filtrarxclasepadre(event).subscribe((res:any = []) => {
        if (res.length > 0) {
          this.selectedItem = res[0]['idhijo'];
          this.form.controls.subclase.setValue(this.selectedItem);
          this.subclase = res
          $('#subcategoria_update').append('<option value=' + this.subclase.idhijo + '  >' + this.subclase.clasehijo + '</option>');
          iziToast.success({
          title: 'Succes',
          position: 'topRight',
          message: 'Subcategorias Encontradas',
         });
        //  $("#subclase option[value=]").attr('selected', 'selected');
        } else {
          iziToast.error({
          title: 'Error',
          position: 'topRight',
          message: 'Esta categoria no tiene subclases',
         });
        }
      });
    }
   editar(produ) {
    const data = [produ];
    this.almacenServ.Readxid(produ.id_clase_producto).subscribe((res: any = []) => {
      $('#modalUpdate').modal('show');
      this.form.controls.idproducto.setValue(produ.id_product);
      this.form.controls.pro_nombre.setValue(produ.pro_name);
      this.form.controls.pro_precio_compra.setValue(produ.pro_precio_compra);
      this.form.controls.pro_precio_venta.setValue(produ.pro_precio_compra);
      this.form.controls.cantidad.setValue(produ.pro_cantidad);
      this.form.controls.cantidad_minima.setValue(produ.pro_cantidad_min);
      this.form.controls.codigo.setValue(produ.pro_code);
      this.form.controls.descripcion.setValue(produ.pro_description);
      this.form.controls.codigo_barra.setValue(produ.pro_cod_barra);
      data.forEach(prod => {
        res['clapadre'].forEach(clapadre => {
          if (prod.id_clase_producto === clapadre.id_clase_producto) {
            this.form.controls.clase.setValue(clapadre.id_clase_producto);
            $('#clase_update').append('<option value=' + clapadre.id_clase_producto + '  selected >' + clapadre.clasepadre + '</option>');
          } else {
            $('#clase_update').append('<option value=' + clapadre.id_clase_producto + '  >' + clapadre.clasepadre + '</option>');
          }
        });
        res['clahijo'].forEach(clahijo => {
          if (prod.id_subclase === clahijo.id_clase_producto) {
            this.form.controls.subclase.setValue(clahijo.id_clase_producto);
           $('#subcategoria_update').append('<option value=' + clahijo.id_clase_producto + '  selected >' + clahijo.clasehijo + '</option>');
          } else {
           $('#subcategoria_update').append('<option value=' + clahijo.id_clase_producto + '  >' + clahijo.clasehijo + '</option>');
          }
        });
        res['lote'].forEach(lote => {
          if (prod.id_lote === lote.id_lote) {
            this.form.controls.lote.setValue(lote.id_lote);
            $('#lote_update').append('<option value=' + lote.id_lote + '  selected >' + lote.lot_name + '</option>');
          } else {
            $('#lote_update').append('<option value=' + lote.id_lote + '  >' + lote.lot_name + '</option>');
          }
        });
        res['unidad'].forEach(uni => {
          if (prod.id_unidad_medida === uni.id_unidad_medida) {
            this.form.controls.unidad.setValue(uni.id_unidad_medida);
            $('#unidad_update').append('<option value=' + uni.id_unidad_medida + ' selected >' + uni.um_name + '</option>');
          } else {
            $('#unidad_update').append('<option value=' + uni.id_unidad_medida + '  >' + uni.um_name + '</option>');
          }
        });
      });
    });
   }
   Actualizar() {
    this.almacenServ.Upddate(this.form.value).subscribe(res => {
      if ( res['status'] === true) {
        $('#modalUpdate').modal('hide');
        this.Listar();
        this.reset();
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
   addaaray() {
    const cod = document.getElementById('codigo')["value"];
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
            localStorage.removeItem('lasidproducto');
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
     const cantidaGenerate = document.getElementById('cantida_generate')['value'];
     for (let i = 0; i < cantidaGenerate; i++) {
      $('#divbarcodeprint').append('<svg style="width:10; height: 10; display:none" id="barcodeprint"></svg>');
      JsBarcode('#barcodeprint', this.gncodebarra, {
        format: 'CODE128',
        width: 2,
        height: 50,
        marginLeft: 85
      });
    }
     this.imprimir();
     $('#divbarcodeprint').empty();
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
    reset() {
      this.form.reset();
      this.form.controls.idproducto.setValue(0);
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
   select2() {
    $('.lote').select2({ width: '100%' });
    $('.clase').select2({ width: '100%' });
    $('.unidad').select2({ width: '100%' });
    $('.cantida_generate').select2({ width: '100%' });
    $('.subclase').select2({ width: '100%' });
   }
}
