import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import iziToast from 'izitoast';
import { AlmacenService } from '../../service/Almacen/almacen.service';
import swal from 'sweetalert2';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
declare const $: any;
import * as JsBarcode from 'jsbarcode';
import { ProductoService } from '../../service/Almacen/producto/producto.service';
declare const sendRespuesta: any;
@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})
export class ProductoComponent implements OnInit {
  form: FormGroup;
  gncodebarra = '';
  productActive = [];
  productDisable = [];
  isScroll: boolean;
  infiniteScrollStatus: boolean;
  isloadinglista: boolean;
  params = {
    numeroRecnum: 0,
    numeroCantidad: 10,
    noMore: false
  };
  constructor(private produService: ProductoService, private fb: FormBuilder) {
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
  ngOnInit(): void {
    this.Listar();
  }
  onScrollDown(ev) {
    console.log('scrolled down!!', ev);
    this.isScroll = true;
    this.Listar();
  }
  Listar() {
    const vm = this;
    vm.infiniteScrollStatus = true;
    this.isloadinglista = true;
    if (!vm.isScroll) {
      vm.productActive = [];
      vm.params.numeroRecnum = 0;
    }
    vm.produService.Read(vm.params).then(res => {
      const rpta = sendRespuesta(res);
      const active = rpta.data.lista.filter( f => f.pro_status === 'active');
      const disabled = rpta.data.lista.filter( f => f.pro_status === 'disabled');
      // tslint:disable-next-line:prefer-for-of
      for (let index = 0; index < active.length; index++) {
        vm.productActive.push(active[index]);
      }
      // tslint:disable-next-line:prefer-for-of
      for (let index = 0; index < disabled.length; index++) {
        vm.productDisable.push(disabled[index]);
      }
      vm.datatable('.tbProductoActive', vm.productActive);
      vm.datatable('.tbProductoEnabled', vm.productDisable);
      if (!rpta.data.noMore) {
        vm.params.numeroRecnum  = rpta.data.numeroRecnum;
        vm.infiniteScrollStatus = false;
      } else {
        vm.infiniteScrollStatus = true;
      }
    }).catch((err) => {
      vm.isScroll = false;
      console.log('Error', err);
    }).finally(() => {
      this.isloadinglista = false;
    });
  }
  datatable(url, data) {
    console.log('data', data);
    $(url).DataTable({
       // tslint:disable-next-line:object-literal-shorthand
       data: data,
        columns: [
        { data: 'pro_name'},
        { data: 'pro_cod_barra'},
        { data: 'pro_precio_compra'},
        { data: 'pro_precio_venta'},
        { data: 'pro_cantidad' },
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
          // vem.editar(data);
         });
        $('.delete', row).bind('click', () => {

          // vem.delete(data);
         });
        $('.status', row).bind('click', () => {
          //  vem.changestatus(data);
         });
        $('.printcodebarra', row).bind('click', () => {
          // vem.printcodebarra(data);
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

}
