import { Component, OnInit } from '@angular/core';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { CompraService } from '../../service/compras/compra.service';
declare const $: any;
declare const sendRespuesta: any;
@Component({
  selector: 'app-list-productos-mas-comprados',
  templateUrl: './list-productos-mas-comprados.component.html',
  styleUrls: ['./list-productos-mas-comprados.component.sass']
})
export class ListProductosMasCompradosComponent implements OnInit {
  mensaje;
  constructor(private dynamicScriptLoader: DynamicScriptLoaderService, private compraserv: CompraService) { }
  ngOnInit() {
    this.startScript();
  }
  async startScript() {
    await this.dynamicScriptLoader.load('form.min').then(data => {
      this.loadData();
    }).catch(error => console.log(error));
  }
  private loadData() {
    const vm = this;
    $('.tablePorductosMasVendidos').DataTable({
      "lengthMenu": [[10, 20, 30, 100, 'all'], [10, 20, 30, 100, 'all']],
      // data: datos,
      // columns: [
      //   { data: 'pro_name' },
      //   { data: 'cantidad' ,
      //   render(data, type, row) {
      //     return '<input id="cantidad_table"  type="text" class="validate updatecantidad" value=' + row.cantidad + '>';
      //   },
      //  },
      //  { data: 'precio' },
      //  { data: 'subTotal' },
      //  { data: () => {
      //   // tslint:disable-next-line:max-line-length
      //   return ('<a _ngcontent-nti-c14=""  class="btn btn-tbl-delete delete" style="margin-left: 30px;" ><i _ngcontent-nti-c14="" class="material-icons" style="color:white">delete_forever</i></a>');
      // }
      // },
      // ],
      // responsive: true,
      // rowCallback: ( row, data ) => {
      //   const vm = this;
      //   $('.delete', row).bind('click', () => {
      //     vm.delete(data);
      //   });
      //   $('.updatecantidad', row).bind('keyup.enter' , (e) => {
      //       vm.UpdateCantidad(data, e);
      //   });
      //   $('td:nth-child(3)', row).css('text-align', 'center');
      //   $('td:nth-child(4)', row).css('text-align', 'center');
      // },
      // language: {
      //   decimal: '',
      //   emptyTable: 'No exsiten Compras',
      //   info: 'Mostrando _START_ a _END_ de _TOTAL_ Compras',
      //   infoEmpty: 'Mostrando 0 to 0 of 0 Entradas',
      //   infoFiltered: '(Filtrado de _MAX_ total Compras)',
      //   infoPostFix: "",
      //   thousands: ",",
      //   lengthMenu: 'Mostrar _MENU_ Compras',
      //   loadingRecords: 'Cargando...',
      //   processing: 'Procesando...',
      //   search: 'Buscar:',
      //   zeroRecords: 'Sin resultados encontrados',
      //   paginate: {
      //     first: 'Primero',
      //     last: 'Ultimo',
      //     next: 'Siguiente',
      //     previous: 'Anterior'
      //   }
      // },
      order: [],
      destroy: true
    });
  }
  Listar(value) {
    this.mensaje = value;
    alert(this.mensaje);
  }
  datatable(url, datos) {
    $(url).DataTable({
      "lengthMenu": [[3, 10, 20, 50], [3, 10, 20, 50]],
      data: datos,
      columns: [
        { data: 'pro_name' },
       { data: 'precio' },
       { data: 'subTotal' },
       { data: () => {
        // tslint:disable-next-line:max-line-length
        return ('<a _ngcontent-nti-c14=""  class="btn btn-tbl-delete delete" style="margin-left: 30px;" ><i _ngcontent-nti-c14="" class="material-icons" style="color:white">delete_forever</i></a>');
      }
      },
      ],
      responsive: true,
      rowCallback: ( row, data ) => {
      },
      language: {
        decimal: '',
        emptyTable: 'No exsiten Compras',
        info: 'Mostrando _START_ a _END_ de _TOTAL_ Compras',
        infoEmpty: 'Mostrando 0 to 0 of 0 Entradas',
        infoFiltered: '(Filtrado de _MAX_ total Compras)',
        infoPostFix: '',
        thousands: ',',
        lengthMenu: 'Mostrar _MENU_ Compras',
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
