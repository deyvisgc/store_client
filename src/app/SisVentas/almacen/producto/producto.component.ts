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
  productXlote = [];
  productXunidad = [];
  lote = [];
  column = [];
  isScroll = false;
  infiniteScrollStatus: boolean;
  isloadinglista: boolean;
  isLoading: boolean;
  params = {
    numeroRecnum: 0,
    numeroRecnumXUnidad : 0,
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
  listError = [];
  constructor(private produService: ProductoService, private loteService: LoteService,
              private dynamicScriptLoader: DynamicScriptLoaderService) {
  }
  ngOnInit() {
    this.fetch();
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
      vm.productXlote = [];
      vm.productXunidad = [];
      vm.params.numeroRecnum = 0;
    }
    vm.produService.Read(vm.params).then(res => {
      const rpta = sendRespuesta(res);
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < rpta.data.productxlote.length; i++) {
        vm.productXlote.push(rpta.data.productxlote[i]);
      }
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < rpta.data.productxUnidad.length; j++) {
        vm.productXunidad.push(rpta.data.productxUnidad[j]);
      }
      if (!rpta.data.noMore ||  !rpta.data.noMoreXUnidad) {
        vm.params.numeroRecnum  = rpta.data.numeroRecnum;
        vm.params.numeroRecnumXUnidad = rpta.data.numeroRecnumXunidad;
        vm.infiniteScrollStatus = false;
      } else {
        vm.infiniteScrollStatus = true;
      }
      if (vm.productXunidad.length > 0) {
        const column = [
          { data: 'pro_name'},
          { data: 'precio_compra'},
          { data: 'precio_venta'},
          { data: 'cantidad'},
          { data: 'pro_cod_barra'},
          { data: 'pro_fecha_creacion'},
          { data: 'clasePadre' },
          { data: 'pro_status' },
          { data: (product) => {
            let btn = '';
            if (product.pro_status === 'active') {
              // tslint:disable-next-line:max-line-length
              btn = '<button _ngcontent-baq-c8="" title="Desactivar" style="margin-left: 5px" class="btn btn-danger btn-circle waves-effect waves-circle waves-float changeStatus" type="button"><i _ngcontent-ccs-c5="" class="fas fa-times-circle" style="font-size: 20px"></i></button>';
            } else {
              // tslint:disable-next-line:max-line-length
              btn = '<button _ngcontent-baq-c8="" title="Activar" style="margin-left: 5px" class="btn btn-success btn-circle waves-effect waves-circle waves-float changeStatus" type="button"><i class="fas fa-check-circle" style="font-size: 20px"></i></button>';
            }
            return (
              // tslint:disable-next-line:max-line-length
              '<button _ngcontent-baq-c8="" title="Actualizar" style="margin-left: 5px" class="btn btn-success btn-circle waves-effect waves-circle waves-float editar" type="button"><i style="font-size: 20px" class="fas fa-pen btnedit" ></i> <i class="fas fa-spinner fa-spin reload"></i></button>' +
              // tslint:disable-next-line:max-line-length
              '<button _ngcontent-baq-c8="" title="Imprimir codigo de barra" style="margin-left: 5px" class="btn btn-info btn-circle waves-effect waves-circle waves-float printcodebarra" type="button"><i style="font-size: 20px" class="fas fa-print"></i></button>' +
              btn
            );
           }
          },
        ];
        vm.datatable('.tbProductoxUnidad', column, vm.productXunidad, 'unidad');
      }
      if (vm.productXlote.length > 0) {
        const column = [
          { data: 'pro_name'},
          { data: 'pro_cod_barra'},
          { data: 'pro_fecha_creacion'},
          { data: 'clasePadre' },
          { data: 'unidad' },
          { data: 'pro_status' },
          { data: (product) => {
            let btn = '';
            if (product.pro_status === 'active') {
              // tslint:disable-next-line:max-line-length
              btn = '<button _ngcontent-baq-c8="" title="Desactivar" style="margin-left: 5px" class="btn btn-danger btn-circle waves-effect waves-circle waves-float changeStatus" type="button"><i _ngcontent-ccs-c5="" class="fas fa-times-circle" style="font-size: 20px"></i></button>';
            } else {
              // tslint:disable-next-line:max-line-length
              btn = '<button _ngcontent-baq-c8="" title="Activar" style="margin-left: 5px" class="btn btn-success btn-circle waves-effect waves-circle waves-float changeStatus" type="button"><i class="fas fa-check-circle" style="font-size: 20px"></i></button>';
            }
            return (
              // tslint:disable-next-line:max-line-length
              '<button _ngcontent-baq-c8="" title="Actualizar" style="margin-left: 5px" class="btn btn-success btn-circle waves-effect waves-circle waves-float editar" type="button"><i style="font-size: 20px" class="fas fa-pen btnedit" ></i> <i class="fas fa-spinner fa-spin reload"></i></button>' +
              // tslint:disable-next-line:max-line-length
              '<button _ngcontent-baq-c8="" title="Imprimir codigo de barra" style="margin-left: 5px" class="btn btn-info btn-circle waves-effect waves-circle waves-float printcodebarra" type="button"><i style="font-size: 20px" class="fas fa-print"></i></button>' +
              btn
            );
           }
          },
        ];
        vm.datatable('.tbProductoLote', column, vm.productXlote, 'lote');
      }
    }).catch(() => {
      vm.isScroll = false;
    }).finally(() => {
      vm.isloadinglista = false;
      vm.filtros.isLoadingTrue();
    });
  }
  datatable(url, column, data, typeProducto) {
    $(url).DataTable({
       // tslint:disable-next-line:object-literal-shorthand
       data: data,
       columns: column,
       rowCallback: (row: Node, data: any[] | Object, index: number) => {
          const vm = this;
          $('.editar', row).bind('click', () => {
            $('.btnedit', row).hide();
            $('.reload', row).show();
            vm.Editar(data, typeProducto, row);
          });
          $('.changeStatus', row).bind('click', () => {
            vm.ChangeStatus(data);
          });
          $('.printcodebarra', row).bind('click', () => {
            vm.PrintCodeBarra(data);
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
  Editar(produ, typeProducto, row) {
    const vm = this;
    vm.title = 'Actualizar Producto';
    const obj = {
      idClase: produ.id_clase_producto,
      idProduct: produ.id_product,
      typeProducto
    };
    console.log('actualizar', obj);
    vm.produService.edit(obj).then(res => {
      const rpta = sendRespuesta(res);
      $('#modalProductos').modal('show');
      vm.formProductoUpdate.edit(rpta);
    }).catch((err) => {
      console.log('Error', err);
    }).finally(() => {
      $('.btnedit', row).show();
      $('.reload', row).hide();
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
  ChangeStatus(producto: any) {
    const vm = this;
    let titulo = '';
    let texto = '';
    if (producto.pro_status === 'active') {
      titulo = 'Desactivar';
      texto = 'Seguro de Desabilitar este producto ?';
    } else {
      titulo = 'Habilitar';
      texto = 'Seguro de Habilitar este producto ?';
    }
    swal.fire({
      title: titulo,
      text:  texto,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#008000',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Cambiar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const data = [{id: producto.id_product, status: producto.pro_status}];
        vm.produService.ChangeStatus(data).then (res => {
          const rpta = sendRespuesta(res);
          if (rpta.status) {
            swal.fire(
              'Actualizado!',
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
  productlist(event) {
    if (event) {
      $('#modalProductos').modal('hide');
      this.fetch();
    }
  }
  showModalProduct() {
    const vm = this;
    $('#seleccionarTipoProducto').modal('show');
  }
  seleccionar(opcion) {
    const vm = this;
    if (opcion === 1) {
      vm.formProductoUpdate.validateRegisto('lotes');
    } else {
      vm.formProductoUpdate.validateRegisto('unidad');
    }
    vm.title = 'Registrar Producto';
    $('#seleccionarTipoProducto').modal('hide');
    $('#modalProductos').modal('show');
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
      numeroRecnumXUnidad : 0,
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
      if (opcion === 'excel') {
        a.download     = `ReporteProductos${((new Date()).getTime())}.xlsx`;
      } else {
        a.download     = `ReporteProductos${((new Date()).getTime())}.pdf`;
      }
      a.click();
      window.URL.revokeObjectURL(url);
    }).catch((err) => {
      console.log('Error', err);
    }).finally(() => {
      vm.filtros.isLoadingTrue();
    });
  }
  error(error) {
    const vm = this;
    $('#modal-errores').modal('show');
    vm.listError = error;
  }
  close() {
    const vm = this;
    vm.listError = vm.listError;
    $('#modal-errores').modal('hide');
    $('#modalProductos').modal('hide');
  }
}
