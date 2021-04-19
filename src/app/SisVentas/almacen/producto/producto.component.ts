import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import iziToast from 'izitoast';
import { AlmacenService } from '../../service/Almacen/almacen.service';
import swal from 'sweetalert2';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
declare const $: any;
import * as JsBarcode from 'jsbarcode';
@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
  isloadinglista: boolean;
  form: FormGroup;
  gncodebarra = '';
  constructor(private almacenServ: AlmacenService, private fb: FormBuilder, private dynamicScriptLoader: DynamicScriptLoaderService) {
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
      descripcion: [null, Validators.required],
      idproducto : [null],
      codigo     : [null]
    });
   }
  ngOnInit() {
    this.startScript();
    $('body').on('hidden.bs.modal', '.modal', () => {
        $('#clase_update').empty();
        $('#lote_update').empty();
        $('#unidad_update').empty();
        $('#subcategoria_update').empty();
      });
    this.Listar();
  }
  private loadData() {
    this.changeselect('.clase', '.subclase', '.lote', '.unidad');
   }
   async startScript() {
    await this.dynamicScriptLoader.load('form.min').then(data => {
      this.loadData();
    }).catch(error => console.log(error));
   }
   public Listar() {
      let datadesacti: any = [];
      let dataactiva: any = [];
      this.isloadinglista = true;
      $('#tableactive').hide();
      $('#tabledesactivi').hide();
      this.almacenServ.Read().subscribe((data: any = [] ) => {
        this.isloadinglista = false;
        $('#tableactive').show();
        $('#tabledesactivi').show();
        if (data.length > 0) {
          dataactiva = data.filter(o => o.pro_status === 'active');
          datadesacti = data.filter(o => o.pro_status === 'disable');
          this.datatable('.tbproductodesac', datadesacti);
          this.datatable('.tbproducto', dataactiva);
        } else {
          this.datatable('.tbproducto', data);
          this.datatable('.tbproducto-desactivida', data);
        }
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
          if (row.pro_status === 'active') {
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
   delete(info: any) {
    let me = this;
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });
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
   showDataSearch(event) {
     const dataactive = event.filter( f => f.pro_status === 'active');
     const datadesact = event.filter( f => f.pro_status === 'disable');
     console.log('dataactive', dataactive);
     console.log('datadesact', datadesact);
     this.datatable('.tbproducto', dataactive);
     this.datatable('.tbproductodesac', datadesact);
   }
   productlist(event) {
    if (event === true) {
       this.Listar();
     }
   }
   public changeclasehija(event) {
    this.form.controls.clase.setValue(event);
    this.almacenServ.filtrarxclasepadre(event).subscribe((res: any = []) => {
      if (res.length > 0) {
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
   changeselect(clase , subclase, lote , unidad) {
    $(clase).select2({width: '100%'}).on('change', (event) => {
    this.changeclasehija(event.target.value);
    });
    $(subclase).select2({width: '100%'}).on('change', (event) => {
    this.form.controls.subclase.setValue(event.target.value);
    });
    $(lote).select2({width: '100%'}).on('change', (event) => {
    this.form.controls.lote.setValue(event.target.value);
    });
    $(unidad).select2({width: '100%'}).on('change', (event) => {
    this.form.controls.unidad.setValue(event.target.value);
    });
    $('.cantida_generate').select2({ width: '100%' });
   }
}