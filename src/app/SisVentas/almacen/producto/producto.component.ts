import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import iziToast from 'izitoast';
import { AlmacenService } from '../../service/Almacen/almacen.service';
import swal from 'sweetalert2';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
declare const $: any;
import * as JsBarcode from 'jsbarcode';
import { ProductoService } from '../../service/Almacen/producto/producto.service';
import { LoteService } from '../../service/Almacen/lote/lote.service';
declare const sendRespuesta: any;
@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})
export class ProductoComponent implements OnInit {
  @ViewChild('formProducto', {static: true}) formProductoUpdate;
  @ViewChild('filtros', {static: true}) filtros;
  form: FormGroup;
  gncodebarra = '';
  productActive = [];
  productDisable = [];
  lote = [];
  isScroll = false;
  infiniteScrollStatus: boolean;
  isloadinglista: boolean;
  isLoading: boolean;
  params = {
    numeroRecnum: 0,
    numeroCantidad: 20,
    noMore: false,
    idClase: 0,
    idUnidad: 0,
    desde: '',
    hasta: '',
    isExport: ''
  };
  title = '';
  nameProduct = '';
  constructor(private produService: ProductoService, private loteService: LoteService,
              private dynamicScriptLoader: DynamicScriptLoaderService) {
  }
  ngOnInit() {
    this.fetch();
    this.startScript();
  }
  async startScript() {
    await this.dynamicScriptLoader.load('form.min').then(data => {
      $('.cantida_generate').select2({ width: '100%' });
    }).catch(error => console.log(error));
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
      vm.productActive = [];
      vm.params.numeroRecnum = 0;
    }
    vm.produService.Read(vm.params).then(res => {
      const rpta = sendRespuesta(res);
      console.log('rpta', rpta);
      const active = rpta.data.lista.filter( f => f.pro_status === 'active');
      const disabled = rpta.data.lista.filter( f => f.pro_status === 'disable');
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < active.length; i++) {
        vm.productActive.push(active[i]);
      }
      console.log('active', vm.productActive);
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < disabled.length; j++) {
        vm.productDisable.push(disabled[j]);
      }
      console.log('disabled', vm.productDisable);
      if (!rpta.data.noMore) {
        vm.params.numeroRecnum  = rpta.data.numeroRecnum;
        vm.infiniteScrollStatus = false;
      } else {
        vm.infiniteScrollStatus = true;
      }
      vm.datatable('.tbProductoActive', vm.productActive);
      vm.datatable('.tbProductoEnabled', vm.productDisable);
    }).catch(() => {
      vm.isScroll = false;
    }).finally(() => {
      vm.isloadinglista = false;
      vm.filtros.isLoadingTrue();
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
        { data: 'pro_fecha_creacion'},
        { data: 'clasePadre' },
        { data: 'unidad' },
        { data: (product) => {
          let btn = '';
          if (product.pro_status === 'active') {
            btn = '<li _ngcontent-aai-c5=""><a _ngcontent-aai-c5="" class="changeStatus">' +
                  '<i _ngcontent-ccs-c5="" class="fas fa-times-circle" style="font-size: 12px"></i> Desactivar</a></li>';
          } else {
            btn = '<li _ngcontent-aai-c5=""><a _ngcontent-aai-c5="" class="changeStatus">' +
            '<i _ngcontent-ccs-c5="" class="fas fa-times-circle" style="font-size: 12px"></i> Activar</a></li>';
          }
          return (
             // tslint:disable-next-line:max-line-length
             '<div class="btn-group"><button style="background-color: #48c78e !important" type="button" class="btn btn-danger">' +
             '<i _ngcontent-eev-c7="" class="fas fa-align-justify"></i></button>' +
             '<button type="button" style="background-color: #48c78e !important"class="btn dropdown-toggle" data-toggle="dropdown">' +
             '<span class="caret" style="color: white !important"></span>' +
             '<ul class="dropdown-menu" role="menu"><li>' +
             '<a class="edit"><i style="font-size: 12px" class="fas fa-pen" ></i> Actualizar</a></li>' +
             '<li><a class="delete"><i style="font-size: 12px" class="fas fa-trash-alt"></i> Eliminar</a>' +
             '</li><li><a class="printcodebarra"><i style="font-size: 12px" class="fas fa-print"></i> Imprimir Codigo Barra</a></li>' +
              btn + '<li class="divider"></li><li><a class="verlote"><i style="font-size: 12px" class="fas fa-eye"></i> Lotes</a></li></ul>'
          );
      }
        },
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const vm = this;
        $('.edit').bind('click', () => {
           vm.isLoading = false;
           vm.Editar(data);
         });
        $('.delete', row).bind('click', () => {
          vm.Delete(data);
         });
        $('.changeStatus', row).bind('click', () => {
          vm.ChangeStatus(data);
         });
        $('.printcodebarra', row).bind('click', () => {
          vm.PrintCodeBarra(data);
        });
        $('.verlote', row).bind('click', () => {
          vm.Lotes(data);
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
  Editar(produ) {
    const vm = this;
    vm.title = 'Actualizar Producto';
    const obj = {
      idClase: produ.id_clase_producto,
      idProduct: produ.id_product
    };
    vm.produService.edit(obj).then(res => {
      const rpta = sendRespuesta(res);
      $('#modalProductos').modal('show');
      vm.formProductoUpdate.edit(rpta);
    }).catch((err) => {
      console.log('Error', err);
    }).finally(() => {
    });
  }
  Delete(producto: any) {
    const vm = this;
    swal.fire({
      title: 'Eliminar',
      text:  'Seguro de eliminar este producto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#008000',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        vm.produService.Delete(producto.id_product).then(res => {
          const rpta = sendRespuesta(res);
          if (rpta.status) {
            swal.fire(
              'Eliminado!',
              rpta.message,
              'success'
            );
          } else {
            swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: rpta.message,
            });
          }
        }).catch((err) => {
          console.log('Error', err);
        }).finally(() => {
          vm.fetch();
        });
      } else {
        swal.fire({
          icon: 'error',
          title: 'Cancelado',
          text: 'Producto a salvo',
        });
      }
    });
  }
  PrintCodeBarra(code: any) {
    this.gncodebarra = code.pro_cod_barra;
    $('#gcodebarra').modal('show');
  }
  ImprimirCode() {
    const vm = this;
    const cantidaGenerate = document.getElementById('cantida_generate')['value'];
    for (let i = 0; i < cantidaGenerate; i++) {
      $('#divbarcodeprint').append('<svg style="width:10; height: 10; display:none" id="barcodeprint"></svg>');
      JsBarcode('#barcodeprint', vm.gncodebarra, {
        format: 'CODE128',
        width: 2,
        height: 50,
        marginLeft: 85
      });
     }
    vm.imprimir();
    $('#divbarcodeprint').empty();
  }
  imprimir() {
    const ficha = document.getElementById('divbarcodeprint');
    const ventimp = window.open(' ', 'popimpr');
    ventimp.document.write( ficha.innerHTML );
    ventimp.document.close();
    ventimp.print( );
    ventimp.close();
  }
  ChangeStatus(info: any) {
    const vm = this;
    const data = [{id: info.id_product, status: info.pro_status}];
    vm.productDisable = [];
    vm.produService.ChangeStatus(data).then (res => {
      const rpta = sendRespuesta(res);
      if (rpta.status) {
        iziToast.success({
          title: 'Succes',
          position: 'topRight',
          message: rpta.message,
        });
        this.fetch();
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
    });
  }
  productlist(event) {
    if (event) {
      $('#modalProductos').modal('hide');
      this.fetch();
    }
  }
  showModalProduct() {
    const vm = this;
    vm.title = 'Registrar Producto';
    $('#modalProductos').modal('show');
  }
  Lotes(info: any) {
    const vm = this;
    vm.lote = [];
    vm.loteService.getLoteXid(info.id_product).then(res => {
      const rpta = sendRespuesta(res);
      if (rpta.status) {
        vm.lote = rpta.data.lotes;
        vm.nameProduct = info.pro_name;
        $('#moda-lotes').modal('show');
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
    });
  }
  filtroCategoria(event) {
    const vm = this;
    vm.params.idClase = event.id_clase_producto || 0;
    vm.fetch();
  }
  filtroUnidadMedida(event) {
    const vm = this;
    vm.params.idUnidad = event.id_unidad_medida || 0;
    vm.fetch();
  }
  filtroRangoFecha(event) {
    const vm = this;
    vm.params.desde = event.desde;
    vm.params.hasta = event.hasta;
    vm.fetch();
  }
  Actualizar(event) {
    const vm = this;
    vm.fetch();
  }
  Limpiar(event) {
    const vm = this;
    vm.params = {
      numeroRecnum: 0,
      numeroCantidad: 20,
      noMore: false,
      idClase: 0,
      idUnidad: 0,
      desde: '',
      hasta: '',
      isExport: ''
    };
    vm.fetch();
  }
  Exportar(opcion) {
    const vm = this;
    vm.params.isExport = opcion;
    vm.produService.Exportar(vm.params).then( data => {
      const a          = document.createElement('a');
      document.body.appendChild(a);
      const blob       = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,'});
      const url        = window.URL.createObjectURL(blob);
      a.href         = url;
      a.download     = `Excel${((new Date()).getTime())}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    }).catch((err) => {
      console.log('Error', err);
    }).finally(() => {
      vm.filtros.isLoadingTrue();
    });
  }
}
